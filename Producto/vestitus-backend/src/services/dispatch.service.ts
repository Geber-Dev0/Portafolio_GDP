import supabase from '../database';

export interface DispatchPayload {
  sale_id?: string;
  rental_id?: string;
  courier?: string;
  tracking_number?: string;
  shipping_cost?: number;
  shipping_address?: string;
  status?: string;
}

export const findDispatches = async () => {
  const { data, error } = await supabase
    .from('dispatches')
    .select('*, sales(*), rentals(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const findDispatchById = async (id: string) => {
  const { data, error } = await supabase
    .from('dispatches')
    .select('*, sales(*, clients(name)), rentals(*, products(name))')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const createDispatch = async (payload: DispatchPayload) => {
  const { data, error } = await supabase
    .from('dispatches')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateDispatch = async (id: string, payload: Partial<DispatchPayload>) => {
  const { data, error } = await supabase
    .from('dispatches')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};
