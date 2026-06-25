-- Auto-set estimated delivery on new orders (client no longer sends this column)

CREATE OR REPLACE FUNCTION set_order_estimated_delivery()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.estimated_delivery IS NULL THEN
    NEW.estimated_delivery := (COALESCE(NEW.created_at, now())::date + INTERVAL '5 days')::date;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_set_estimated_delivery ON orders;
CREATE TRIGGER orders_set_estimated_delivery
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_estimated_delivery();
