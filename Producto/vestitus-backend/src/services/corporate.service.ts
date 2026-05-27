import supabase from '../database';

export interface CorporatePayload {
  mission?: string;
  vision?: string;
  objectives?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export const findCorporateInfo = async () => {
  const { data, error } = await supabase
    .from('corporate_info')
    .select('*')
    .maybeSingle();
  if (error) throw error;
  return data;
};

export const upsertCorporateInfo = async (id: string, payload: CorporatePayload) => {
  const { data, error } = await supabase
    .from('corporate_info')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};
