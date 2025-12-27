// src/services/admin.service.ts
import api from '@/lib/axios';
import { User } from './auth.service';

export interface AdminFilters {
  page?: number;
  limit?: number;
  role?: 'USER' | 'ADMIN';
  email?: string;
  name?: string;
}

export interface UsersListResponse {
  users: User[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}

export interface PlatformStats {
  totalUsers: number;
  verifiedUsers: number;
  recentUsers: number;
  usersByRole: Array<{ role: string; count: number }>;
}

class AdminService {
  async getAllUsers(filters: AdminFilters = {}): Promise<UsersListResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.role) params.append('role', filters.role);
    if (filters.email) params.append('email', filters.email);
    if (filters.name) params.append('name', filters.name);

    const res = await api.get<UsersListResponse>(`/admin/users?${params.toString()}`);
    return res.data;
  }

  async getUserById(userId: string): Promise<User> {
    const res = await api.get<User>(`/admin/users/${userId}`);
    return res.data;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const res = await api.put<User>(`/admin/users/${userId}`, data);
    return res.data;
  }

  async updateUserRole(userId: string, role: 'USER' | 'ADMIN'): Promise<User> {
    const res = await api.patch<User>(`/admin/users/${userId}/role`, { role });
    return res.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  }

  async getPlatformStats(): Promise<PlatformStats> {
    const res = await api.get<PlatformStats>('/admin/stats');
    return res.data;
  }
}

export const adminService = new AdminService();
export default adminService;
