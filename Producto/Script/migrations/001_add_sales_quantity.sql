ALTER TABLE sales ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1;

CREATE OR REPLACE FUNCTION public.decrement_stock(p_product_id uuid, p_quantity integer DEFAULT 1)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - p_quantity
  WHERE id = p_product_id;
END;
$$;
