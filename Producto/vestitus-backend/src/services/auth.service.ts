import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '@config';
import supabase from '../database';
import { AuthPayload } from '../middleware/auth.middleware';

const SALT_ROUNDS = 12;

export const registerUser = async (email: string, password: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existing) {
    throw new Error('Error al registrar usuario');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const { data, error } = await supabase
    .from('users')
    .insert({
      email: normalizedEmail,
      password_hash: passwordHash,
      role: 'customer'
    })
    .select('id, email, role')
    .single();

  if (error) throw new Error('Error al registrar usuario');

  const payload: AuthPayload = {
    userId: data.id,
    email: data.email,
    role: data.role
  };

  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });

  return {
    token,
    user: {
      id: data.id,
      email: data.email,
      role: data.role
    }
  };
};

export const authenticateUser = async (email: string, password: string) => {
  const normalizedEmail = email.toLowerCase().trim();

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, password_hash, role')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (error || !user) {
    throw new Error('Credenciales inválidas');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error('Credenciales inválidas');
  }

  const payload: AuthPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
};

export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    throw new Error('Usuario no encontrado');
  }

  return data;
};
