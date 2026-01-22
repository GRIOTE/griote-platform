// src/services/admin.service.ts
import api from '../lib/axios';
import type { User } from './auth.service';

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
  totalDepots: number;
  totalDocuments: number;
}

export interface Category {
  category_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  tag_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Depot {
  depot_id: string;
  owner_id: string;
  title: string;
  description?: string;
  category_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  documents?: any[];
  tags?: Tag[];
}

// USERS
export async function getAllUsers(filters: AdminFilters = {}): Promise<UsersListResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.role) params.append('role', filters.role);
  if (filters.email) params.append('email', filters.email);
  if (filters.name) params.append('name', filters.name);

  const res = await api.get<UsersListResponse>(`/users/admin/users?${params.toString()}`);
  return res.data;
}

export async function getUserById(userId: string): Promise<User> {
  const res = await api.get<User>(`/users/admin/users/${userId}`);
  return res.data;
}

export async function updateUser(userId: string, data: Partial<User>): Promise<User> {
  const res = await api.put<User>(`/users/admin/users/${userId}`, data);
  return res.data;
}

export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN'): Promise<User> {
  const res = await api.patch<User>(`/users/admin/users/${userId}/role`, { role });
  return res.data;
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/users/admin/users/${userId}`);
}

export async function createUser(data: { email: string; password: string; first_name: string; last_name: string }): Promise<User> {
  const res = await api.post<User>('/users/admin/users', data);
  return res.data;
}

// STATS
export async function getTotalUsers(): Promise<{ totalUsers: number }> {
  const res = await api.get<{ totalUsers: number }>('/users/stats/total-users');
  return res.data;
}

export async function getVerifiedUsers(): Promise<{ verifiedUsers: number }> {
  const res = await api.get<{ verifiedUsers: number }>('/users/stats/verified-users');
  return res.data;
}

export async function getTotalDepots(): Promise<{ totalDepots: number }> {
  const res = await api.get<{ totalDepots: number }>('/depot/stats/total-depots');
  return res.data;
}

export async function getTotalDocuments(): Promise<{ totalDocuments: number }> {
  const res = await api.get<{ totalDocuments: number }>('/depot/stats/total-documents');
  return res.data;
}

// CATEGORIES
export async function getCategories(): Promise<Category[]> {
  const res = await api.get<Category[]>('/categories');
  return res.data;
}

export async function createCategory(data: { name: string; description?: string }): Promise<Category> {
  const res = await api.post<Category>('/categories', data);
  return res.data;
}

export async function updateCategory(categoryId: string, data: Partial<Category>): Promise<Category> {
  const res = await api.patch<Category>(`/categories/${categoryId}`, data);
  return res.data;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await api.delete(`/categories/${categoryId}`);
}

// TAGS
export async function getTags(): Promise<Tag[]> {
  const res = await api.get<Tag[]>('/tags');
  return res.data;
}

export async function createTag(data: { name: string }): Promise<Tag> {
  const res = await api.post<Tag>('/tags', data);
  return res.data;
}

export async function updateTag(tagId: string, data: Partial<Tag>): Promise<Tag> {
  const res = await api.patch<Tag>(`/tags/${tagId}`, data);
  return res.data;
}

export async function deleteTag(tagId: string): Promise<void> {
  await api.delete(`/tags/${tagId}`);
}

// DEPOTS
export async function getDepots(): Promise<Depot[]> {
  const res = await api.get<Depot[]>('/depot');
  return res.data;
}

export async function deleteDepot(depotId: string): Promise<void> {
  await api.delete(`/depot/${depotId}`);
}
