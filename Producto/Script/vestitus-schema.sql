
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  category text,
  type text,
  price numeric(12,2) NOT NULL DEFAULT 0,
  status text,
  stock_quantity integer NOT NULL DEFAULT 0,
  condition text,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  public_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE,
  phone text,
  address text,
  client_type text,
  tax_document text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS damage_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  surcharge_amount numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rentals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  start_date date,
  end_date date,
  period_type text,
  rental_price numeric(12,2) NOT NULL DEFAULT 0,
  appointment_date date,
  appointment_time time,
  status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS returns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  rental_id uuid REFERENCES rentals(id) ON DELETE CASCADE,
  return_date date,
  return_time time,
  product_state text,
  damage_type_id uuid REFERENCES damage_types(id) ON DELETE CASCADE,
  damage_fee numeric(12,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sales (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  sale_price numeric(12,2) NOT NULL DEFAULT 0,
  payment_method text,
  payment_status text,
  shipping_cost numeric(12,2) NOT NULL DEFAULT 0,
  status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS dispatches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id uuid REFERENCES sales(id) ON DELETE CASCADE,
  rental_id uuid REFERENCES rentals(id) ON DELETE CASCADE,
  courier text,
  tracking_number text,
  shipping_cost numeric(12,2) NOT NULL DEFAULT 0,
  shipping_address text,
  status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS corporate_info (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission text,
  vision text,
  objectives text,
  address text,
  phone text,
  email text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);


CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_clients_client_type ON clients(client_type);
CREATE INDEX IF NOT EXISTS idx_rentals_client_id ON rentals(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_dispatches_sale_id ON dispatches(sale_id);
CREATE INDEX IF NOT EXISTS idx_dispatches_rental_id ON dispatches(rental_id);



ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP FUNCTION IF EXISTS public.user_role();
CREATE OR REPLACE FUNCTION public.user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT role FROM public.users WHERE id = auth.uid()
$$;

DROP POLICY IF EXISTS "products_select_anon" ON products;
CREATE POLICY "products_select_anon" ON products FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "products_select_auth" ON products;
CREATE POLICY "products_select_auth" ON products FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "products_insert_employee" ON products;
CREATE POLICY "products_insert_employee" ON products FOR INSERT TO authenticated WITH CHECK (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "products_update_employee" ON products;
CREATE POLICY "products_update_employee" ON products FOR UPDATE TO authenticated USING (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "products_delete_admin" ON products;
CREATE POLICY "products_delete_admin" ON products FOR DELETE TO authenticated USING (public.user_role() = 'admin');

DROP POLICY IF EXISTS "product_images_select_anon" ON product_images;
CREATE POLICY "product_images_select_anon" ON product_images FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "product_images_select_auth" ON product_images;
CREATE POLICY "product_images_select_auth" ON product_images FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "product_images_insert_employee" ON product_images;
CREATE POLICY "product_images_insert_employee" ON product_images FOR INSERT TO authenticated WITH CHECK (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "product_images_update_employee" ON product_images;
CREATE POLICY "product_images_update_employee" ON product_images FOR UPDATE TO authenticated USING (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "product_images_delete_admin" ON product_images;
CREATE POLICY "product_images_delete_admin" ON product_images FOR DELETE TO authenticated USING (public.user_role() = 'admin');

DROP POLICY IF EXISTS "clients_select_own" ON clients;
CREATE POLICY "clients_select_own" ON clients FOR SELECT TO authenticated USING (id = auth.uid() OR public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "clients_insert_self" ON clients;
CREATE POLICY "clients_insert_self" ON clients FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "clients_insert_employee" ON clients;
CREATE POLICY "clients_insert_employee" ON clients FOR INSERT TO authenticated WITH CHECK (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "clients_update_own" ON clients;
CREATE POLICY "clients_update_own" ON clients FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "clients_update_employee" ON clients;
CREATE POLICY "clients_update_employee" ON clients FOR UPDATE TO authenticated USING (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "clients_delete_admin" ON clients;
CREATE POLICY "clients_delete_admin" ON clients FOR DELETE TO authenticated USING (public.user_role() = 'admin');

DROP POLICY IF EXISTS "damage_types_select_anon" ON damage_types;
CREATE POLICY "damage_types_select_anon" ON damage_types FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "damage_types_select_auth" ON damage_types;
CREATE POLICY "damage_types_select_auth" ON damage_types FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "damage_types_insert_employee" ON damage_types;
CREATE POLICY "damage_types_insert_employee" ON damage_types FOR INSERT TO authenticated WITH CHECK (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "damage_types_update_employee" ON damage_types;
CREATE POLICY "damage_types_update_employee" ON damage_types FOR UPDATE TO authenticated USING (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "damage_types_delete_admin" ON damage_types;
CREATE POLICY "damage_types_delete_admin" ON damage_types FOR DELETE TO authenticated USING (public.user_role() = 'admin');

DROP POLICY IF EXISTS "rentals_select_own" ON rentals;
CREATE POLICY "rentals_select_own" ON rentals FOR SELECT TO authenticated USING (
  client_id = auth.uid() OR public.user_role() IN ('admin', 'employee')
);
DROP POLICY IF EXISTS "rentals_insert_customer" ON rentals;
CREATE POLICY "rentals_insert_customer" ON rentals FOR INSERT TO authenticated WITH CHECK (
  client_id = auth.uid() AND public.user_role() = 'customer'
);
DROP POLICY IF EXISTS "rentals_insert_employee" ON rentals;
CREATE POLICY "rentals_insert_employee" ON rentals FOR INSERT TO authenticated WITH CHECK (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "rentals_update_employee" ON rentals;
CREATE POLICY "rentals_update_employee" ON rentals FOR UPDATE TO authenticated USING (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "rentals_delete_admin" ON rentals;
CREATE POLICY "rentals_delete_admin" ON rentals FOR DELETE TO authenticated USING (public.user_role() = 'admin');

DROP POLICY IF EXISTS "returns_select_own" ON returns;
CREATE POLICY "returns_select_own" ON returns FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM rentals WHERE rentals.id = rental_id AND rentals.client_id = auth.uid())
  OR public.user_role() IN ('admin', 'employee')
);
DROP POLICY IF EXISTS "returns_insert_employee" ON returns;
CREATE POLICY "returns_insert_employee" ON returns FOR INSERT TO authenticated WITH CHECK (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "returns_update_employee" ON returns;
CREATE POLICY "returns_update_employee" ON returns FOR UPDATE TO authenticated USING (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "returns_delete_admin" ON returns;
CREATE POLICY "returns_delete_admin" ON returns FOR DELETE TO authenticated USING (public.user_role() = 'admin');

DROP POLICY IF EXISTS "sales_select_own" ON sales;
CREATE POLICY "sales_select_own" ON sales FOR SELECT TO authenticated USING (
  client_id = auth.uid() OR public.user_role() IN ('admin', 'employee')
);
DROP POLICY IF EXISTS "sales_insert_customer" ON sales;
CREATE POLICY "sales_insert_customer" ON sales FOR INSERT TO authenticated WITH CHECK (
  client_id = auth.uid() AND public.user_role() = 'customer'
);
DROP POLICY IF EXISTS "sales_insert_employee" ON sales;
CREATE POLICY "sales_insert_employee" ON sales FOR INSERT TO authenticated WITH CHECK (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "sales_update_employee" ON sales;
CREATE POLICY "sales_update_employee" ON sales FOR UPDATE TO authenticated USING (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "sales_delete_admin" ON sales;
CREATE POLICY "sales_delete_admin" ON sales FOR DELETE TO authenticated USING (public.user_role() = 'admin');

DROP POLICY IF EXISTS "dispatches_select_own" ON dispatches;
CREATE POLICY "dispatches_select_own" ON dispatches FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM sales WHERE sales.id = sale_id AND sales.client_id = auth.uid())
  OR public.user_role() IN ('admin', 'employee')
);
DROP POLICY IF EXISTS "dispatches_insert_employee" ON dispatches;
CREATE POLICY "dispatches_insert_employee" ON dispatches FOR INSERT TO authenticated WITH CHECK (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "dispatches_update_employee" ON dispatches;
CREATE POLICY "dispatches_update_employee" ON dispatches FOR UPDATE TO authenticated USING (public.user_role() IN ('admin', 'employee'));
DROP POLICY IF EXISTS "dispatches_delete_admin" ON dispatches;
CREATE POLICY "dispatches_delete_admin" ON dispatches FOR DELETE TO authenticated USING (public.user_role() = 'admin');

DROP POLICY IF EXISTS "corporate_info_select_anon" ON corporate_info;
CREATE POLICY "corporate_info_select_anon" ON corporate_info FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "corporate_info_select_auth" ON corporate_info;
CREATE POLICY "corporate_info_select_auth" ON corporate_info FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "corporate_info_update_employee" ON corporate_info;
CREATE POLICY "corporate_info_update_employee" ON corporate_info FOR UPDATE TO authenticated USING (public.user_role() IN ('admin', 'employee'));

DROP POLICY IF EXISTS "users_select_admin" ON users;
CREATE POLICY "users_select_admin" ON users FOR SELECT TO authenticated USING (public.user_role() = 'admin' OR id = auth.uid());
DROP POLICY IF EXISTS "users_insert_admin" ON users;
CREATE POLICY "users_insert_admin" ON users FOR INSERT TO authenticated WITH CHECK (public.user_role() = 'admin');
DROP POLICY IF EXISTS "users_update_admin" ON users;
CREATE POLICY "users_update_admin" ON users FOR UPDATE TO authenticated USING (public.user_role() = 'admin');
DROP POLICY IF EXISTS "users_delete_admin" ON users;
CREATE POLICY "users_delete_admin" ON users FOR DELETE TO authenticated USING (public.user_role() = 'admin');

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;

GRANT SELECT ON products, product_images, damage_types, corporate_info TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- ============================================================
-- STORED PROCEDURES (P.A.)
-- ============================================================

DROP FUNCTION IF EXISTS public.create_rental(uuid, uuid, date, date, text, numeric);
CREATE OR REPLACE FUNCTION public.create_rental(
  p_client_id uuid,
  p_product_id uuid,
  p_start_date date,
  p_end_date date,
  p_period_type text DEFAULT 'days',
  p_rental_price numeric DEFAULT 0
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_rental_id uuid;
BEGIN
  INSERT INTO rentals (client_id, product_id, start_date, end_date, period_type, rental_price, status)
  VALUES (p_client_id, p_product_id, p_start_date, p_end_date, p_period_type, p_rental_price, 'active')
  RETURNING id INTO v_rental_id;

  UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = p_product_id;

  RETURN v_rental_id;
END;
$$;

DROP FUNCTION IF EXISTS public.process_return(uuid, text, uuid, text);
CREATE OR REPLACE FUNCTION public.process_return(
  p_rental_id uuid,
  p_product_state text,
  p_damage_type_id uuid DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_return_id uuid;
  v_damage_fee numeric := 0;
  v_product_id uuid;
BEGIN
  SELECT product_id INTO v_product_id FROM rentals WHERE id = p_rental_id;

  IF p_damage_type_id IS NOT NULL THEN
    SELECT surcharge_amount INTO v_damage_fee FROM damage_types WHERE id = p_damage_type_id;
  END IF;

  INSERT INTO returns (rental_id, return_date, return_time, product_state, damage_type_id, damage_fee, notes)
  VALUES (p_rental_id, CURRENT_DATE, CURRENT_TIME, p_product_state, p_damage_type_id, v_damage_fee, p_notes)
  RETURNING id INTO v_return_id;

  UPDATE products
  SET stock_quantity = stock_quantity + 1,
      is_available = CASE WHEN p_product_state IN ('lost', 'damaged') THEN false ELSE true END
  WHERE id = v_product_id;

  UPDATE rentals SET status = 'returned' WHERE id = p_rental_id;

  RETURN v_return_id;
END;
$$;

-- ============================================================
-- TEST DATA
-- ============================================================

-- Seed admin user (bcrypt hash)
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@tienda.cl', '$2b$12$LJ3m4ys3Lk0TSwHnbfOMiOXPm1Qlq5Gz0YhGv0G0O0t0H0s0K0O', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Damage types
INSERT INTO damage_types (name, description, surcharge_amount) VALUES
  ('Desgarro menor', 'Pequeño desgarro en costura o tela', 5000),
  ('Mancha', 'Mancha visible que requiere lavado especial', 3000),
  ('Pérdida total', 'Prenda no devuelta o destruida', 50000),
  ('Cierre dañado', 'Cierre o cremallera en mal estado', 8000)
ON CONFLICT DO NOTHING;

-- Products
INSERT INTO products (name, description, category, type, price, status, stock_quantity, condition, is_available) VALUES
  ('Vestido Largo Floral', 'Vestido largo estampado floral, tela ligera', 'Vestidos', 'arriendo', 25000, 'nuevo', 3, 'excelente', true),
  ('Terno Clásico Gris', 'Terno dos piezas, corte moderno', 'Ternos', 'arriendo', 45000, 'nuevo', 2, 'excelente', true),
  ('Zapatos de Cuero Negro', 'Zapatos formales de cuero, talla 42', 'Calzado', 'venta', 35000, 'nuevo', 5, 'excelente', true),
  ('Corbata Seda Azul', 'Corbata de seda azul marino', 'Accesorios', 'venta', 12000, 'nuevo', 10, 'excelente', true),
  ('Vestido Noche Rojo', 'Vestido de gala rojo con pedrería', 'Vestidos', 'arriendo', 35000, 'nuevo', 2, 'excelente', true)
ON CONFLICT DO NOTHING;

-- Corporate info
INSERT INTO corporate_info (mission, vision, objectives, address, phone, email) VALUES
  (
    'Ofrecer vestuario de calidad para arriendo y venta, facilitando el acceso a moda elegante y sostenible.',
    'Ser la plataforma líder de arriendo de vestuario en Chile, reconocida por nuestra calidad y servicio.',
    'Expandir nuestro catálogo, digitalizar procesos y reducir el desperdicio textil promoviendo la economía circular.',
    'Av. Providencia 1234, Santiago, Chile',
    '+56 9 1234 5678',
    'contacto@vestitus.cl'
  )
ON CONFLICT DO NOTHING;
