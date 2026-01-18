import type { Tag } from '../types/tag';
import api from '../lib/axios';

export async function getTags(): Promise<Tag[]> {
  const res = await api.get('/tags');
  return res.data;
}

export async function createTag(name: string): Promise<Tag> {
  const res = await api.post('/tags', { name });
  return res.data;
}

export async function updateTag(tagId: number, data: { name: string }): Promise<Tag> {
  const res = await api.patch(`/tags/${tagId}`, data);
  return res.data;
}

export async function deleteTag(tagId: number): Promise<void> {
  await api.delete(`/tags/${tagId}`);
}
