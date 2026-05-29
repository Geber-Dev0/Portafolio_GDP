import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida')
});

export const damageTypeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional().default(''),
  surcharge_amount: z.number().min(0, 'El recargo no puede ser negativo')
});

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  price: z.number().min(0, 'El precio no puede ser negativo'),
  status: z.string().optional(),
  stock_quantity: z.number().int().min(0).optional(),
  condition: z.string().optional(),
  is_available: z.boolean().optional(),
  size: z.string().optional(),
  color: z.string().optional()
});

export const clientSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  client_type: z.enum(['natural', 'company', 'cultural']).optional(),
  tax_document: z.string().optional()
});

export const rentalSchema = z.object({
  client_id: z.string().uuid('Cliente inválido'),
  product_id: z.string().uuid('Producto inválido'),
  start_date: z.string().min(1, 'Fecha de inicio requerida'),
  end_date: z.string().min(1, 'Fecha de término requerida'),
  period_type: z.enum(['days', 'weeks', 'months']),
  appointment_date: z.string().optional(),
  appointment_time: z.string().optional(),
  status: z.string().optional()
});

export const returnSchema = z.object({
  rental_id: z.string().uuid('Arriendo inválido'),
  return_date: z.string().optional(),
  return_time: z.string().optional(),
  product_state: z.enum(['good', 'damaged', 'lost']).optional(),
  damage_type_id: z.string().uuid().optional().or(z.literal('')),
  notes: z.string().optional()
});

export const saleSchema = z.object({
  client_id: z.string().uuid('Cliente inválido'),
  product_id: z.string().uuid('Producto inválido'),
  sale_price: z.number().min(0, 'El precio no puede ser negativo'),
  payment_method: z.string().optional(),
  payment_status: z.string().optional(),
  shipping_cost: z.number().min(0).optional(),
  status: z.string().optional()
});

export const dispatchSchema = z.object({
  sale_id: z.string().uuid().optional().or(z.literal('')),
  rental_id: z.string().uuid().optional().or(z.literal('')),
  courier: z.string().optional(),
  tracking_number: z.string().optional(),
  shipping_cost: z.number().min(0).optional(),
  shipping_address: z.string().optional(),
  status: z.string().optional()
});

export const corporateSchema = z.object({
  mission: z.string().optional(),
  vision: z.string().optional(),
  objectives: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal(''))
});

export const availabilitySchema = z.object({
  product_id: z.string().uuid('Producto inválido'),
  start_date: z.string().min(1, 'Fecha de inicio requerida'),
  end_date: z.string().min(1, 'Fecha de término requerida')
});
