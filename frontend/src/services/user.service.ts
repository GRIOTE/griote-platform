// src/services/user.service.ts
import api from '@/lib/axios';
import { User } from './auth.service';

class UserService {
  async getProfile(): Promise<User> {
    const res = await api.get<User>('/users/me');
    return res.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await api.put<User>('/users/me', data);
    return res.data;
  }
}

export const userService = new UserService();
export default userService;
