import { authService, User } from './auth.service';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

export interface AdminFilters {
  page?: number;
  limit?: number;
  role?: 'USER' | 'ADMIN';
  email?: string;
  name?: string;
}

class AdminService {
  async getAllUsers(filters: AdminFilters = {}): Promise<UsersListResponse> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.role) params.append('role', filters.role);
    if (filters.email) params.append('email', filters.email);
    if (filters.name) params.append('name', filters.name);

    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/users?${params.toString()}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch users');
    }

    return await response.json();
  }

  async getUserById(userId: number): Promise<User> {
    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/users/${userId}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch user');
    }

    return await response.json();
  }

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/users/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }

    return await response.json();
  }

  async updateUserRole(userId: number, role: 'USER' | 'ADMIN'): Promise<User> {
    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/users/${userId}/role`,
      {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user role');
    }

    return await response.json();
  }

  async resetUserPassword(userId: number, newPassword: string): Promise<void> {
    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/users/${userId}/reset-password`,
      {
        method: 'PATCH',
        body: JSON.stringify({ newPassword }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset password');
    }
  }

  async deleteUser(userId: number): Promise<void> {
    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/users/${userId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }
  }

  async getPlatformStats(): Promise<PlatformStats> {
    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/stats`,
      { method: 'GET' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch stats');
    }

    return await response.json();
  }

  async createAdmin(adminData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Promise<User> {
    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/admin/users`,
      {
        method: 'POST',
        body: JSON.stringify(adminData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create admin');
    }

    return await response.json();
  }
}

export const adminService = new AdminService();
export default adminService;
