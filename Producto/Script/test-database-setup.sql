-- ============================================================
-- Script de configuración de Base de Datos de Pruebas
-- Vestitus — Plataforma de Arriendo y Venta de Vestuario
-- ============================================================
-- Propósito: Crear una base de datos de pruebas idéntica en
-- estructura a producción pero con datos controlados para
-- la ejecución del plan de pruebas.
-- ============================================================
-- Instrucciones:
-- 1. Crear un proyecto separado en Supabase (plan free)
-- 2. Ejecutar este script en SQL Editor
-- 3. Configurar .env.test con las credenciales del proyecto
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── TABLAS ────────────────────────────────────────────────

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
  size text,
  color text,
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
  quantity integer NOT NULL DEFAULT 1,
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

-- ─── ÍNDICES ───────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);

-- ─── DATOS DE PRUEBA ───────────────────────────────────────

-- Usuario admin de prueba
INSERT INTO users (email, password_hash, role) VALUES
  ('test@vestitus.cl', '$2b$12$LJ3m4ys3Lk0TSwHnbfOMiOXPm1Qlq5Gz0YhGv0G0O0t0H0s0K0O', 'admin'),
  ('employee@vestitus.cl', '$2b$12$LJ3m4ys3Lk0TSwHnbfOMiOXPm1Qlq5Gz0YhGv0G0O0t0H0s0K0O', 'employee'),
  ('customer@vestitus.cl', '$2b$12$LJ3m4ys3Lk0TSwHnbfOMiOXPm1Qlq5Gz0YhGv0G0O0t0H0s0K0O', 'customer')
ON CONFLICT (email) DO NOTHING;

-- Clientes de prueba
INSERT INTO clients (name, email, phone, client_type) VALUES
  ('Cliente Test Uno', 'test@vestitus.cl', '+56 9 1111 1111', 'natural'),
  ('Cliente Test Dos', 'cliente2@test.cl', '+56 9 2222 2222', 'empresa')
ON CONFLICT DO NOTHING;

-- Tipos de daño
INSERT INTO damage_types (name, description, surcharge_amount) VALUES
  ('Desgarro menor', 'Pequeño desgarro en costura o tela', 5000),
  ('Mancha', 'Mancha visible que requiere lavado especial', 3000),
  ('Pérdida total', 'Prenda no devuelta o destruida', 50000)
ON CONFLICT DO NOTHING;

-- Productos de prueba
INSERT INTO products (name, description, category, type, price, status, stock_quantity, condition, is_available, size, color) VALUES
  ('Vestido Largo Floral Test', 'Vestido largo estampado floral', 'Vestidos', 'arriendo', 25000, 'nuevo', 3, 'excelente', true, 'M', 'Rojo'),
  ('Terno Clásico Gris Test', 'Terno dos piezas, corte moderno', 'Ternos', 'arriendo', 45000, 'nuevo', 2, 'excelente', true, 'L', 'Gris'),
  ('Zapatos de Cuero Test', 'Zapatos formales de cuero', 'Calzado', 'venta', 35000, 'nuevo', 5, 'excelente', true, '42', 'Negro'),
  ('Corbata Seda Test', 'Corbata de seda azul marino', 'Accesorios', 'venta', 12000, 'nuevo', 10, 'excelente', true, 'Única', 'Azul')
ON CONFLICT DO NOTHING;

-- Arriendo de prueba (activo)
INSERT INTO rentals (client_id, product_id, start_date, end_date, period_type, rental_price, status)
SELECT c.id, p.id, CURRENT_DATE + 1, CURRENT_DATE + 5, 'days', p.price * 5, 'active'
FROM clients c, products p
WHERE c.email = 'test@vestitus.cl' AND p.name = 'Vestido Largo Floral Test'
LIMIT 1;

-- Venta de prueba (completada)
INSERT INTO sales (client_id, product_id, sale_price, quantity, payment_status, status)
SELECT c.id, p.id, p.price, 1, 'paid', 'completed'
FROM clients c, products p
WHERE c.email = 'test@vestitus.cl' AND p.name = 'Corbata Seda Test'
LIMIT 1;

-- Info corporativa de prueba
INSERT INTO corporate_info (mission, vision, objectives, address, phone, email) VALUES
  (
    'Misión de prueba para tests automatizados.',
    'Visión de prueba para tests automatizados.',
    'Objetivos de prueba para tests automatizados.',
    'Dirección de prueba, Santiago',
    '+56 9 0000 0000',
    'test@vestitus.cl'
  )
ON CONFLICT DO NOTHING;

-- ─── RLS (Row Level Security) ──────────────────────────────

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

-- Policy básica: service_role tiene acceso completo
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO service_role;
