import supabase from '../database';
import { adjustStock, setProductAvailability } from './product.service';

export interface ReturnPayload {
  rental_id: string;
  return_date?: string;
  return_time?: string;
  product_state?: string;
  damage_type_id?: string;
  notes?: string;
}

export const findReturns = async () => {
  const { data, error } = await supabase
    .from('returns')
    .select('*, rentals(*), damage_types(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const findReturnById = async (id: string) => {
  const { data, error } = await supabase
    .from('returns')
    .select('*, rentals(*, products(name)), damage_types(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const createReturn = async (payload: ReturnPayload) => {
  const { data: rental } = await supabase
    .from('rentals')
    .select('id, product_id')
    .eq('id', payload.rental_id)
    .single();

  if (!rental) throw new Error('Arriendo no encontrado');

  let damageFee = 0;
  if (payload.damage_type_id) {
    const { data: damageType } = await supabase
      .from('damage_types')
      .select('surcharge_amount')
      .eq('id', payload.damage_type_id)
      .single();

    if (damageType) {
      damageFee = Number(damageType.surcharge_amount);
    }
  }

  const productState = payload.product_state || 'good';
  const isDamaged = productState === 'damaged' || productState === 'lost';

  const { data, error } = await supabase
    .from('returns')
    .insert({
      rental_id: payload.rental_id,
      return_date: payload.return_date || new Date().toISOString().split('T')[0],
      return_time: payload.return_time,
      product_state: productState,
      damage_type_id: payload.damage_type_id || null,
      damage_fee: damageFee,
      notes: payload.notes
    })
    .select()
    .single();

  if (error) throw error;

  if (isDamaged) {
    await setProductAvailability(rental.product_id, false);
  } else {
    await adjustStock(rental.product_id, 1);
  }

  return { ...data, calculated_damage_fee: damageFee };
};
