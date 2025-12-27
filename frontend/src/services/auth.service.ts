// src/services/auth.service.ts
import api from '@/lib/axios';

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  is_email_verified: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  requiresInterfaceSelection: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/auth/login', { email, password });

    if (res.data && res.data.accessToken && res.data.user) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      return res.data;
    } else {
      throw new Error('Invalid response format from server');
    }
  }

  async register(userData: RegisterData): Promise<{ message: string; emailToken: string }> {
    const res = await api.post('/auth/register', userData);
    return res.data;
  }

  async refresh(): Promise<string> {
    const res = await api.post('/auth/refresh');
    localStorage.setItem('accessToken', res.data.accessToken);
    return res.data.accessToken;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const res = await api.post('/auth/resend-verification', { email });
    return res.data;
  }

  getUser(): User | null {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }

  hasRole(role: 'USER' | 'ADMIN'): boolean {
    const user = this.getUser();
    return user?.role === role;
  }
}

export const authService = new AuthService();
export default authService;
