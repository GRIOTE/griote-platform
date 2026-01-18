import type { Category } from '../types/category';
import api from '../lib/axios';

export async function getCategories(): Promise<Category[]> {
  const res = await api.get('/categories');
  return res.data;
}

export async function createCategory(name: string): Promise<Category> {
  const res = await api.post('/categories', { name });
  return res.data;
}

export async function updateCategory(categoryId: number, name: string): Promise<Category> {
  const res = await api.patch(`/categories/${categoryId}`, { name });
  return res.data;
}

export async function deleteCategory(categoryId: number): Promise<void> {
  await api.delete(`/categories/${categoryId}`);
}