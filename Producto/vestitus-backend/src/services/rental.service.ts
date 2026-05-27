import supabase from '../database';
import { adjustStock, checkAvailabilityByDateRange } from './product.service';

export interface RentalPayload {
  client_id: string;
  product_id: string;
  start_date: string;
  end_date: string;
  period_type: 'days' | 'weeks' | 'months';
  appointment_date?: string;
  appointment_time?: string;
  status?: string;
}

function calculateDays(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function calculateRentalPrice(dailyRate: number, days: number, periodType: string): number {
  switch (periodType) {
    case 'weeks':
      return dailyRate * 7 * Math.ceil(days / 7);
    case 'months':
      return dailyRate * 30 * Math.ceil(days / 30);
    case 'days':
    default:
      return dailyRate * days;
  }
}

export const findRentals = async () => {
  const { data, error } = await supabase
    .from('rentals')
    .select('*, clients(name, email), products(name, price)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const findRentalById = async (id: string) => {
  const { data, error } = await supabase
    .from('rentals')
    .select('*, clients(*), products(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const createRental = async (payload: RentalPayload) => {
  const { data: product } = await supabase
    .from('products')
    .select('id, price, stock_quantity')
    .eq('id', payload.product_id)
    .single();

  if (!product) throw new Error('Producto no encontrado');
  if ((product.stock_quantity ?? 0) <= 0) throw new Error('Stock insuficiente');

  const availability = await checkAvailabilityByDateRange(
    payload.product_id, payload.start_date, payload.end_date
  );
  if (!availability.available) {
    throw new Error(availability.reason || 'Producto no disponible en esas fechas');
  }

  const days = calculateDays(payload.start_date, payload.end_date);
  const rentalPrice = calculateRentalPrice(Number(product.price), days, payload.period_type);

  const { data, error } = await supabase
    .from('rentals')
    .insert({
      client_id: payload.client_id,
      product_id: payload.product_id,
      start_date: payload.start_date,
      end_date: payload.end_date,
      period_type: payload.period_type,
      rental_price: rentalPrice,
      appointment_date: payload.appointment_date,
      appointment_time: payload.appointment_time,
      status: payload.status || 'confirmed'
    })
    .select()
    .single();

  if (error) throw error;

  await adjustStock(payload.product_id, -1);

  return { ...data, calculated_price: rentalPrice, days };
};

export const updateRental = async (id: string, payload: Partial<RentalPayload>) => {
  const { data, error } = await supabase
    .from('rentals')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteRental = async (id: string) => {
  const { data: rental, error: findError } = await supabase
    .from('rentals')
    .select('product_id')
    .eq('id', id)
    .single();

  if (findError || !rental) throw new Error('Arriendo no encontrado');

  const { error } = await supabase
    .from('rentals')
    .delete()
    .eq('id', id);

  if (error) throw error;

  await adjustStock(rental.product_id, 1);

  return { id };
};
