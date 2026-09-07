CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sku text UNIQUE,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quantity int NOT NULL DEFAULT 0,
  low_stock_threshold int NOT NULL DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own categories"
ON categories FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own products"
ON products FOR ALL
USING (auth.uid() = user_id);

-- Atomic inventory adjustment for the authenticated product owner.
CREATE OR REPLACE FUNCTION public.adjust_product_quantity(
  product_id uuid,
  adjustment_amount integer
)
RETURNS public.products
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  updated_product public.products;
BEGIN
  UPDATE public.products
  SET
    quantity = quantity + adjustment_amount,
    updated_at = now()
  WHERE id = product_id
    AND user_id = auth.uid()
    AND quantity + adjustment_amount >= 0
  RETURNING * INTO updated_product;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found or quantity adjustment would make inventory negative';
  END IF;

  RETURN updated_product;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.adjust_product_quantity(uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.adjust_product_quantity(uuid, integer) TO authenticated;