import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type NotificationType = 'order_placed' | 'status_update';

interface OrderItem {
  product_name: string;
  size: string;
  quantity: number;
  total: number;
}

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  total: number;
  shipping_address: {
    full_name?: string;
    phone?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  tracking_number: string | null;
  estimated_delivery: string | null;
  carrier: string | null;
  user_id: string | null;
  order_items: OrderItem[];
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildTrackingUrl(siteUrl: string, orderNumber: string, trackingNumber?: string | null): string {
  const params = new URLSearchParams({ tab: 'current-orders', order: orderNumber });
  if (trackingNumber) params.set('tracking', trackingNumber);
  return `${siteUrl}/account?${params.toString()}`;
}

function formatAddress(addr: OrderRow['shipping_address']): string {
  const lines = [
    addr.full_name,
    addr.address_line1,
    addr.address_line2,
    [addr.city, addr.state, addr.pincode].filter(Boolean).join(', '),
    addr.phone ? `Phone: ${addr.phone}` : null,
  ].filter(Boolean);
  return lines.join('\n');
}

function formatSizeDisplay(size: string): string {
  const normalized = size.trim().toLowerCase().replace(/\s+/g, '');
  if (/^1(l|liter|litre)$/.test(normalized) || normalized === '1000ml') {
    return '1 liter';
  }
  return size;
}

function formatBottleLabel(quantity: number, size: string): string {
  const sizeLabel = formatSizeDisplay(size);
  const bottleWord = quantity === 1 ? 'bottle' : 'bottles';
  return `${quantity} ${bottleWord} of ${sizeLabel}`;
}

function buildProductSummary(items: OrderItem[]): string {
  return items
    .map((i) => `${i.product_name} — ${formatBottleLabel(i.quantity, i.size)} — ${formatPrice(i.total)}`)
    .join('\n');
}

function getSubject(type: NotificationType, order: OrderRow): string {
  if (type === 'order_placed') {
    return `Order Confirmed — ${order.order_number} | Kamdhara Farms`;
  }
  return `Order Update: ${formatStatus(order.status)} — ${order.order_number}`;
}

function buildEmailHtml(order: OrderRow, type: NotificationType, trackingUrl: string): string {
  const title = type === 'order_placed' ? 'Thank you for your order!' : `Your order is now ${formatStatus(order.status)}`;
  const estDelivery = order.estimated_delivery
    ? new Date(order.estimated_delivery).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Within 5–7 business days';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Georgia, serif; background: #F5EFE4; padding: 24px; color: #3E2B1F;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(62,43,31,0.08);">
    <div style="background: #3E2B1F; padding: 24px; text-align: center;">
      <h1 style="color: #C8A76A; margin: 0; font-size: 24px;">Kamdhara Farms</h1>
      <p style="color: #F5EFE4; margin: 8px 0 0; font-size: 14px;">Pure A2 Ghee, Farm to Home</p>
    </div>
    <div style="padding: 28px;">
      <h2 style="margin: 0 0 8px; font-size: 20px;">${title}</h2>
      <p style="color: #8B6A4E; margin: 0 0 20px;">Order ID: <strong>${order.order_number}</strong></p>

      <div style="background: #F5EFE4; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; font-weight: bold;">Products</p>
        <pre style="margin: 0; font-family: Inter, sans-serif; font-size: 13px; white-space: pre-wrap; color: #3E2B1F;">${buildProductSummary(order.order_items)}</pre>
        <p style="margin: 12px 0 0; font-size: 16px;"><strong>Total: ${formatPrice(order.total)}</strong></p>
        <p style="margin: 8px 0 0; font-size: 13px; color: #8B6A4E;">Payment: ${order.payment_method.toUpperCase()}</p>
      </div>

      <p style="margin: 0 0 4px; font-weight: bold;">Shipping Address</p>
      <pre style="margin: 0 0 20px; font-family: Inter, sans-serif; font-size: 13px; white-space: pre-wrap; color: #8B6A4E;">${formatAddress(order.shipping_address)}</pre>

      <p style="margin: 0 0 4px;"><strong>Estimated Delivery:</strong> ${estDelivery}</p>
      ${order.tracking_number ? `<p style="margin: 8px 0 0;"><strong>Tracking #:</strong> ${order.tracking_number}</p>` : ''}
      ${order.carrier ? `<p style="margin: 4px 0 0; color: #8B6A4E;">Carrier: ${order.carrier}</p>` : ''}

      <a href="${trackingUrl}" style="display: inline-block; margin-top: 24px; background: #C8A76A; color: #3E2B1F; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold;">Track Your Order</a>
    </div>
    <div style="padding: 16px 28px; background: #F5EFE4; font-size: 12px; color: #8B6A4E; text-align: center;">
      Questions? Reply to this email or WhatsApp us at +91 87667 03485
    </div>
  </div>
</body>
</html>`;
}

function buildWhatsAppMessage(order: OrderRow, type: NotificationType, trackingUrl: string): string {
  const headline =
    type === 'order_placed'
      ? `✅ *Order Confirmed* — Kamdhara Farms`
      : `📦 *Order Update: ${formatStatus(order.status)}*`;

  const estDelivery = order.estimated_delivery
    ? new Date(order.estimated_delivery).toLocaleDateString('en-IN')
    : '5–7 business days';

  const products = order.order_items
    .map((i) => `• ${i.product_name} — ${formatBottleLabel(i.quantity, i.size)}`)
    .join('\n');

  return [
    headline,
    '',
    `Order ID: *${order.order_number}*`,
    '',
    '*Items:*',
    products,
    '',
    `*Amount:* ${formatPrice(order.total)}`,
    `*Payment:* ${order.payment_method.toUpperCase()}`,
    '',
    '*Delivery Address:*',
    formatAddress(order.shipping_address),
    '',
    `*Est. Delivery:* ${estDelivery}`,
    order.tracking_number ? `*Tracking:* ${order.tracking_number}` : null,
    '',
    `Track order: ${trackingUrl}`,
    '',
    'Thank you for choosing Kamdhara Farms 🌿',
  ]
    .filter(Boolean)
    .join('\n');
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'orders@kamdharafarms.com';

  if (!apiKey) {
    console.log('[email stub] Would send to:', to, 'subject:', subject);
    return { sent: false, reason: 'RESEND_API_KEY not configured' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: `Kamdhara Farms <${fromEmail}>`, to: [to], subject, html }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
    return { sent: false, reason: err };
  }

  return { sent: true };
}

async function sendWhatsApp(to: string, message: string): Promise<{ sent: boolean; reason?: string }> {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = Deno.env.get('TWILIO_WHATSAPP_FROM');

  if (!accountSid || !authToken || !from) {
    console.log('[whatsapp stub] Would send to:', to);
    console.log(message);
    return { sent: false, reason: 'Twilio WhatsApp credentials not configured' };
  }

  const phone = to.startsWith('+') ? to : `+91${to.replace(/\D/g, '').slice(-10)}`;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const body = new URLSearchParams({
    From: from,
    To: `whatsapp:${phone}`,
    Body: message,
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Twilio error:', err);
    return { sent: false, reason: err };
  }

  return { sent: true };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderId, type } = (await req.json()) as {
      orderId: string;
      type: NotificationType;
    };

    if (!orderId || !type) {
      throw new Error('orderId and type are required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`*, order_items (*)`)
      .eq('id', orderId)
      .single();

    if (orderError || !order) throw new Error('Order not found');

    const orderRow = order as OrderRow;
    const siteUrl = Deno.env.get('SITE_URL') || 'https://kamdharafarms.com';
    const trackingUrl = buildTrackingUrl(siteUrl, orderRow.order_number, orderRow.tracking_number);

    let recipientEmail: string | null = null;
    let recipientPhone: string | null = orderRow.shipping_address?.phone || null;
    let emailEnabled = true;
    let whatsappEnabled = true;

    if (orderRow.user_id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, phone, email_notifications, whatsapp_notifications')
        .eq('id', orderRow.user_id)
        .single();

      if (profile) {
        recipientEmail = profile.email;
        recipientPhone = profile.phone || recipientPhone;
        emailEnabled = profile.email_notifications !== false;
        whatsappEnabled = profile.whatsapp_notifications !== false;
      }
    }

    const subject = getSubject(type, orderRow);
    const html = buildEmailHtml(orderRow, type, trackingUrl);
    const whatsappBody = buildWhatsAppMessage(orderRow, type, trackingUrl);

    const results = {
      email: { sent: false, reason: 'No recipient email' },
      whatsapp: { sent: false, reason: 'No recipient phone' },
    };

    if (recipientEmail && emailEnabled) {
      results.email = await sendEmail(recipientEmail, subject, html);
    }

    if (recipientPhone && whatsappEnabled) {
      results.whatsapp = await sendWhatsApp(recipientPhone, whatsappBody);
    }

    const notificationLogs = [
      {
        order_id: orderId,
        channel: 'email',
        notification_type: type,
        status: results.email.sent
          ? 'sent'
          : !recipientEmail || !emailEnabled
            ? 'skipped'
            : 'failed',
        details: results.email.sent
          ? `Sent to ${recipientEmail}`
          : results.email.reason || 'Not sent',
      },
      {
        order_id: orderId,
        channel: 'whatsapp',
        notification_type: type,
        status: results.whatsapp.sent
          ? 'sent'
          : !recipientPhone || !whatsappEnabled
            ? 'skipped'
            : 'failed',
        details: results.whatsapp.sent
          ? `Sent to ${recipientPhone}`
          : results.whatsapp.reason || 'Not sent',
      },
    ];

    await supabase.from('order_notifications').insert(notificationLogs);

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
