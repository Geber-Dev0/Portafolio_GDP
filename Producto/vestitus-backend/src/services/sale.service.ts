import supabase from '../database';
import { adjustStock } from './product.service';

export interface SalePayload {
  client_id: string;
  product_id: string;
  sale_price: number;
  quantity?: number;
  payment_method?: string;
  payment_status?: string;
  shipping_cost?: number;
  status?: string;
}

export const findSales = async () => {
  const { data, error } = await supabase
    .from('sales')
    .select('*, clients(*), products(*, product_images(*))')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const findSalesByClientId = async (clientId: string) => {
  const { data, error } = await supabase
    .from('sales')
    .select('*, clients(*), products(*, product_images(*))')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const findSaleById = async (id: string) => {
  const { data, error } = await supabase
    .from('sales')
    .select('*, clients(*), products(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const createSale = async (payload: SalePayload) => {
  const quantity = payload.quantity || 1;

  const { data: product } = await supabase
    .from('products')
    .select('id, stock_quantity')
    .eq('id', payload.product_id)
    .single();

  if (!product) throw new Error('Producto no encontrado');
  if ((product.stock_quantity ?? 0) < quantity) throw new Error('Stock insuficiente');

  const { data, error } = await supabase
    .from('sales')
    .insert({
      client_id: payload.client_id,
      product_id: payload.product_id,
      sale_price: payload.sale_price,
      quantity,
      payment_method: payload.payment_method,
      payment_status: payload.payment_status || 'pending',
      shipping_cost: payload.shipping_cost || 0,
      status: payload.status || 'completed'
    })
    .select()
    .single();

  if (error) throw error;

  await adjustStock(payload.product_id, -quantity);

  return data;
};

export const updateSale = async (id: string, payload: Partial<SalePayload>) => {
  const { data, error } = await supabase
    .from('sales')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};
