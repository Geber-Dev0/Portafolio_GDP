export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'employee' | 'customer';
  createdAt: string;
  updatedAt: string;
}
