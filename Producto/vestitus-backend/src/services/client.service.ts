import supabase from '../database';

export interface ClientPayload {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  client_type?: string;
  tax_document?: string;
}

export const findClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const findClientById = async (id: string) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const findClientByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const createClient = async (payload: ClientPayload) => {
  const { data, error } = await supabase
    .from('clients')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateClient = async (id: string, payload: Partial<ClientPayload>) => {
  const { data, error } = await supabase
    .from('clients')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteClient = async (id: string) => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return { id };
};
