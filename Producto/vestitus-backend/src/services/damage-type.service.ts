import supabase from '../database';

export interface DamageTypePayload {
  name: string;
  description: string;
  surcharge_amount: number;
}

export const getDamageTypes = async () => {
  const { data, error } = await supabase.from('damage_types').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

export const createDamageType = async (payload: DamageTypePayload) => {
  const { data, error } = await supabase.from('damage_types').insert(payload).select().single();
  if (error) throw error;
  return data;
};

export const updateDamageType = async (id: string, payload: Partial<DamageTypePayload>) => {
  const { data, error } = await supabase.from('damage_types').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
};

export const deleteDamageType = async (id: string) => {
  const { error } = await supabase.from('damage_types').delete().eq('id', id);
  if (error) throw error;
  return { id };
};
