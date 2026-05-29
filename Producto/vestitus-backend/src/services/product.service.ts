import supabase from '../database';

export interface ProductPayload {
  name: string;
  description?: string;
  category?: string;
  type?: string;
  price: number;
  status?: string;
  stock_quantity?: number;
  condition?: string;
  is_available?: boolean;
  size?: string;
  color?: string;
}

export interface ProductFilters {
  category?: string;
  type?: string;
  is_available?: boolean;
}

export const findProducts = async (filters?: ProductFilters) => {
  let query = supabase.from('products').select('*, product_images(*)');

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.is_available !== undefined) {
    query = query.eq('is_available', filters.is_available);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const findProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const createProduct = async (payload: ProductPayload) => {
  const { data, error } = await supabase
    .from('products')
    .insert({ ...payload, stock_quantity: payload.stock_quantity ?? 0 })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateProduct = async (id: string, payload: Partial<ProductPayload>) => {
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { id };
};

export const findProductImageById = async (imageId: string) => {
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('id', imageId)
    .single();
  if (error) throw error;
  return data;
};

export const deleteProductImageRecord = async (imageId: string) => {
  const { data, error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId)
    .single();
  if (error) throw error;
  return data;
};

export const createProductImage = async (productId: string, url: string, publicId: string) => {
  const { data, error } = await supabase
    .from('product_images')
    .insert({ product_id: productId, url, public_id: publicId })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const adjustStock = async (productId: string, delta: number) => {
  const { data: product } = await supabase
    .from('products')
    .select('stock_quantity')
    .eq('id', productId)
    .single();

  if (!product) throw new Error('Producto no encontrado');

  const newStock = (product.stock_quantity ?? 0) + delta;
  if (newStock < 0) throw new Error('Stock insuficiente');

  const { data, error } = await supabase
    .from('products')
    .update({ stock_quantity: newStock })
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const setProductAvailability = async (productId: string, isAvailable: boolean) => {
  const { data, error } = await supabase
    .from('products')
    .update({ is_available: isAvailable })
    .eq('id', productId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const checkAvailabilityByDateRange = async (productId: string, startDate: string, endDate: string) => {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('stock_quantity, is_available')
    .eq('id', productId)
    .single();

  if (productError || !product) throw new Error('Producto no encontrado');
  if (!product.is_available) return { available: false, reason: 'Producto no disponible' };
  if ((product.stock_quantity ?? 0) <= 0) return { available: false, reason: 'Sin stock' };

  const { data: overlapping, error: rentalError } = await supabase
    .from('rentals')
    .select('id, start_date, end_date, status')
    .eq('product_id', productId)
    .in('status', ['active', 'confirmed', 'pending'])
    .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

  if (rentalError) throw rentalError;

  if (overlapping && overlapping.length > 0) {
    return { available: false, reason: `Producto reservado del ${overlapping[0].start_date} al ${overlapping[0].end_date}` };
  }

  return { available: true };
};
