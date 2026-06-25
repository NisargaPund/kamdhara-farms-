-- Order status history & notification log for admin order detail view

CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL DEFAULT 'status_change',
  old_status TEXT,
  new_status TEXT,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_status_history_order_id_idx ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS order_status_history_created_at_idx ON order_status_history(created_at DESC);

CREATE TABLE IF NOT EXISTS order_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_notifications_order_id_idx ON order_notifications(order_id);

-- Log order creation
CREATE OR REPLACE FUNCTION log_order_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO order_status_history (order_id, event_type, new_status, notes, metadata, created_at)
  VALUES (
    NEW.id,
    'order_created',
    NEW.status,
    'Order placed',
    jsonb_build_object(
      'payment_status', NEW.payment_status,
      'payment_method', NEW.payment_method,
      'total', NEW.total
    ),
    COALESCE(NEW.created_at, now())
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS orders_log_created ON orders;
CREATE TRIGGER orders_log_created
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_created();

-- Log status, payment, and tracking changes
CREATE OR REPLACE FUNCTION log_order_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, event_type, old_status, new_status, changed_by, notes)
    VALUES (
      NEW.id,
      'status_change',
      OLD.status,
      NEW.status,
      auth.uid(),
      format('Status changed from %s to %s', OLD.status, NEW.status)
    );
  END IF;

  IF OLD.payment_status IS DISTINCT FROM NEW.payment_status THEN
    INSERT INTO order_status_history (order_id, event_type, old_status, new_status, changed_by, notes, metadata)
    VALUES (
      NEW.id,
      'payment_change',
      OLD.payment_status,
      NEW.payment_status,
      auth.uid(),
      format('Payment status changed from %s to %s', OLD.payment_status, NEW.payment_status),
      jsonb_build_object(
        'old_payment_status', OLD.payment_status,
        'new_payment_status', NEW.payment_status
      )
    );
  END IF;

  IF OLD.tracking_number IS DISTINCT FROM NEW.tracking_number
     OR OLD.carrier IS DISTINCT FROM NEW.carrier
     OR OLD.estimated_delivery IS DISTINCT FROM NEW.estimated_delivery THEN
    INSERT INTO order_status_history (order_id, event_type, changed_by, notes, metadata)
    VALUES (
      NEW.id,
      'tracking_update',
      auth.uid(),
      'Tracking information updated',
      jsonb_build_object(
        'old_tracking_number', OLD.tracking_number,
        'new_tracking_number', NEW.tracking_number,
        'old_carrier', OLD.carrier,
        'new_carrier', NEW.carrier,
        'old_estimated_delivery', OLD.estimated_delivery,
        'new_estimated_delivery', NEW.estimated_delivery
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS orders_log_changes ON orders;
CREATE TRIGGER orders_log_changes
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION log_order_changes();

-- Backfill creation events for existing orders
INSERT INTO order_status_history (order_id, event_type, new_status, notes, metadata, created_at)
SELECT
  o.id,
  'order_created',
  o.status,
  'Order placed',
  jsonb_build_object(
    'payment_status', o.payment_status,
    'payment_method', o.payment_method,
    'total', o.total
  ),
  o.created_at
FROM orders o
WHERE NOT EXISTS (
  SELECT 1 FROM order_status_history h
  WHERE h.order_id = o.id AND h.event_type = 'order_created'
);

-- RLS
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_view_order_history" ON order_status_history;
CREATE POLICY "admins_view_order_history" ON order_status_history
  FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "admins_view_order_notifications" ON order_notifications;
CREATE POLICY "admins_view_order_notifications" ON order_notifications
  FOR SELECT TO authenticated
  USING (is_admin());

-- Customers can view their own order history
DROP POLICY IF EXISTS "users_view_own_order_history" ON order_status_history;
CREATE POLICY "users_view_own_order_history" ON order_status_history
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_status_history.order_id AND o.user_id = auth.uid()
    )
  );
