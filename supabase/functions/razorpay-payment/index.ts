import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${orderId}|${paymentId}`)
  );

  return bufferToHex(sig) === signature;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action } = body;

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      const missing = [
        !razorpayKeyId ? 'RAZORPAY_KEY_ID' : null,
        !razorpayKeySecret ? 'RAZORPAY_KEY_SECRET' : null,
      ].filter(Boolean).join(', ');
      throw new Error(
        `Missing secret(s): ${missing}. Go to Project Settings → Edge Functions → Secrets, add them (exact names, no VITE_ prefix), then click Deploy again on razorpay-payment.`
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    if (action === 'create-order') {
      const { orderId, amount } = body;

      if (!orderId || !amount || amount < 100) {
        throw new Error('Invalid order ID or amount (minimum ₹1)');
      }

      const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);

      const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount),
          currency: 'INR',
          receipt: String(orderId).slice(0, 40),
          notes: { store_order_id: orderId },
        }),
      });

      const razorpayOrder = await razorpayResponse.json();

      if (!razorpayResponse.ok) {
        throw new Error(razorpayOrder.error?.description || 'Failed to create Razorpay order');
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({ razorpay_order_id: razorpayOrder.id })
        .eq('id', orderId);

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: razorpayKeyId,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'verify') {
      const {
        storeOrderId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = body;

      if (!storeOrderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new Error('Missing payment verification fields');
      }

      const isValid = await verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        razorpayKeySecret
      );

      if (!isValid) {
        throw new Error('Payment signature verification failed');
      }

      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('id, razorpay_order_id, payment_status')
        .eq('id', storeOrderId)
        .single();

      if (fetchError || !order) {
        throw new Error('Order not found');
      }

      if (order.razorpay_order_id !== razorpay_order_id) {
        throw new Error('Razorpay order mismatch');
      }

      if (order.payment_status !== 'paid') {
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            razorpay_payment_id: razorpay_payment_id,
          })
          .eq('id', storeOrderId);

        if (updateError) throw updateError;
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action. Use create-order or verify.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
