// src/services/auth.service.ts
import api from '../lib/axios';

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  is_email_verified: boolean;
  profile_picture?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  requiresInterfaceSelection: boolean;
}

// LOGIN
export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/login', { email, password });
  localStorage.setItem('accessToken', res.data.accessToken);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data;
}

// REGISTER
export async function register(userData: any): Promise<{ message: string; emailToken: string }> {
  const res = await api.post('/auth/register', userData);
  return res.data;
}

// LOGOUT
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
}

// RESEND VERIFICATION EMAIL
export async function resendVerificationEmail(email: string): Promise<{ message: string }> {
  const res = await api.post('/auth/resend-verification', { email });
  return res.data;
}

// GET USER FROM LOCAL STORAGE
export function getUser(): User | null {
  const stored = localStorage.getItem('user');
  return stored ? JSON.parse(stored) : null;
}

// CHECK AUTHENTICATION
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('accessToken');
}

// CHECK ROLES
export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === 'ADMIN';
}

export function hasRole(role: 'USER' | 'ADMIN'): boolean {
  const user = getUser();
  return user?.role === role;
}