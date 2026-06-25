import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from './supabase';

export const RAZORPAY_SETUP_HINT =
  'Deploy the razorpay-payment Edge Function in Supabase Dashboard → Edge Functions → Deploy new function.';

export interface RazorpayCheckoutOptions {
  storeOrderId: string;
  amountInPaise: number;
  paymentMethod: 'upi' | 'card';
  customer: {
    name: string;
    email?: string;
    phone: string;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email?: string; contact: string };
  theme: { color: string };
  method?: { upi?: boolean; card?: boolean; netbanking?: boolean; wallet?: boolean };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

async function parseFunctionError(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json();
      if (body?.error) return body.error;
    } catch {
      // ignore json parse failure
    }
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = String((error as { message: string }).message);
    if (
      message.toLowerCase().includes('edge function') ||
      message.toLowerCase().includes('failed to send') ||
      message.toLowerCase().includes('not found')
    ) {
      return `Payment server not ready. ${RAZORPAY_SETUP_HINT}`;
    }
    return message;
  }

  return 'Payment failed. Please try again.';
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.getElementById('razorpay-checkout-js');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-checkout-js';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiateRazorpayPayment(
  options: RazorpayCheckoutOptions
): Promise<RazorpayPaymentResponse> {
  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error('Razorpay is not configured. Add VITE_RAZORPAY_KEY_ID to your .env file.');
  }

  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    throw new Error('Failed to load Razorpay checkout. Check your internet connection.');
  }

  const { data, error } = await supabase.functions.invoke('razorpay-payment', {
    body: {
      action: 'create-order',
      orderId: options.storeOrderId,
      amount: options.amountInPaise,
    },
  });

  if (data?.error) {
    throw new Error(data.error);
  }

  if (error) {
    throw new Error(await parseFunctionError(error));
  }

  const { razorpayOrderId, amount, keyId: serverKeyId } = data;

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: serverKeyId || keyId,
      amount,
      currency: 'INR',
      name: 'Kamdhara Farms',
      description: 'A2 Gir Cow Ghee Order',
      order_id: razorpayOrderId,
      prefill: {
        name: options.customer.name,
        email: options.customer.email,
        contact: options.customer.phone,
      },
      theme: { color: '#C8A76A' },
      method: {
        upi: options.paymentMethod === 'upi',
        card: options.paymentMethod === 'card',
        netbanking: false,
        wallet: false,
      },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
    });

    rzp.on('payment.failed', (response) => {
      reject(new Error(response.error?.description || 'Payment failed'));
    });

    rzp.open();
  });
}

export async function verifyRazorpayPayment(
  storeOrderId: string,
  response: RazorpayPaymentResponse
) {
  const { data, error } = await supabase.functions.invoke('razorpay-payment', {
    body: {
      action: 'verify',
      storeOrderId,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
    },
  });

  if (data?.error) {
    throw new Error(data.error);
  }

  if (error) {
    throw new Error(await parseFunctionError(error));
  }

  return data;
}
