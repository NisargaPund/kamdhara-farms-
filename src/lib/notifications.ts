import { supabase } from './supabase';

export type NotificationType = 'order_placed' | 'status_update';

export interface SendNotificationParams {
  orderId: string;
  type: NotificationType;
  previousStatus?: string;
}

export async function sendOrderNotification(params: SendNotificationParams): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('send-order-notification', {
      body: params,
    });
    if (error) {
      console.warn('Order notification failed:', error.message);
    }
  } catch (err) {
    console.warn('Order notification error:', err);
  }
}
