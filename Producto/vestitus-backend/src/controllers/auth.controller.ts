import { Request, Response } from 'express';
import * as authService from '@services/auth.service';

const KNOWN_ERRORS = [
  'Credenciales inválidas',
  'El email ya está registrado',
  'Error al registrar usuario',
  'Usuario no encontrado'
];

function sanitizeError(error: unknown, fallback: string): string {
  if (error instanceof Error && KNOWN_ERRORS.includes(error.message)) {
    return error.message;
  }
  return fallback;
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.authenticateUser(email, password);
    res.json({ success: true, data: result });
  } catch (error) {
    const message = sanitizeError(error, 'Error al iniciar sesión');
    res.status(401).json({ success: false, message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.registerUser(email, password);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    const message = sanitizeError(error, 'Error al registrarse');
    res.status(400).json({ success: false, message });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = await authService.getUserById(req.user!.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    const message = sanitizeError(error, 'Error al obtener usuario');
    res.status(404).json({ success: false, message });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Sesión cerrada correctamente' });
};
