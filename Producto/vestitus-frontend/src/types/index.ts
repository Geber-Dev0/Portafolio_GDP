export interface User {
  id: string
  email: string
  role: 'admin' | 'employee' | 'customer'
  created_at?: string
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  type: 'rent' | 'sale' | 'both'
  price: number
  stock: number
  is_available: boolean
  size?: string
  color?: string
  collection?: string
  images: ProductImage[]
  created_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  created_at: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  client_type: 'natural' | 'empresa' | 'agrupacion_cultural'
  tax_document?: string
  created_at: string
}

export interface Rental {
  id: string
  client_id: string
  product_id: string
  start_date: string
  end_date: string
  period_type: 'days' | 'weeks' | 'months'
  rental_price: number
  status: 'active' | 'completed' | 'cancelled'
  client?: Client
  product?: Product
  created_at: string
}

export interface Return {
  id: string
  rental_id: string
  product_state: string
  damage_type_id?: string
  surcharge_amount?: number
  rental?: Rental
  created_at: string
}

export interface Sale {
  id: string
  client_id: string
  product_id: string
  sale_price: number
  quantity?: number
  payment_status: 'pending' | 'paid' | 'cancelled'
  client?: Client
  product?: Product
  created_at: string
}

export interface Dispatch {
  id: string
  sale_id?: string
  rental_id?: string
  courier: string
  tracking_number: string
  cost: number
  status: 'pending' | 'shipped' | 'delivered'
  created_at: string
}

export interface DamageType {
  id: string
  name: string
  surcharge_amount: number
}

export interface CorporateInfo {
  id: string
  mission: string
  vision: string
  objectives: string
  address: string
  phone: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  status?: number
}
