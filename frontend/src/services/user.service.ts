import { authService, User } from './auth.service';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
  date_of_birth?: string;
}

class UserService {
  async getProfile(): Promise<User> {
    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/users/me`,
      { method: 'GET' }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch profile');
    }

    return await response.json();
  }

  async updateProfile(data: UpdateProfileData): Promise<User> {
    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/users/me`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return await response.json();
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const response = await authService.makeAuthenticatedRequest(
      `${API_BASE_URL}/auth/change-password`,
      {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change password');
    }
  }
}

export const userService = new UserService();
export default userService;
