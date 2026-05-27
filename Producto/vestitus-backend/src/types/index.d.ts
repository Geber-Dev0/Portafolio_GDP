export type Role = 'admin' | 'employee' | 'customer';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}
