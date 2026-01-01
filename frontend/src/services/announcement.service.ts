// src/services/announcement.service.ts
import api from '@/lib/axios';

export interface AnnouncementImage {
  id: number;
  url: string;
  description?: string;
  annonce_id: number;
}

export interface Announcement {
  id: number;
  titre: string;
  contenu: string;
  statut: 'pending' | 'publié' | 'archivé';
  date_creation: string;
  date_publication?: string;
  image_apercu_id?: number;
  imageApercu?: AnnouncementImage;
  Images?: AnnouncementImage[];
}

export interface CreateAnnouncementData {
  titre: string;
  contenu: string;
  image_apercu_id?: number;
}

export interface UpdateAnnouncementData {
  titre?: string;
  contenu?: string;
  image_apercu_id?: number;
}

// PUBLIC
export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  const res = await api.get<Announcement[]>('/annonces');
  return res.data;
}

export async function getAnnouncementById(id: number): Promise<Announcement> {
  const res = await api.get<Announcement>(`/annonces/${id}`);
  return res.data;
}

// ADMIN
export async function createAnnouncement(data: CreateAnnouncementData): Promise<Announcement> {
  const res = await api.post<Announcement>('/admin/annonces', data);
  return res.data;
}

export async function updateAnnouncement(id: number, data: UpdateAnnouncementData): Promise<Announcement> {
  const res = await api.put<Announcement>(`/admin/annonces/${id}`, data);
  return res.data;
}

export async function deleteAnnouncement(id: number): Promise<void> {
  await api.delete(`/admin/annonces/${id}`);
}

export async function publishAnnouncement(id: number): Promise<Announcement> {
  const res = await api.put<Announcement>(`/admin/annonces/${id}/publish`);
  return res.data;
}

export async function archiveAnnouncement(id: number): Promise<Announcement> {
  const res = await api.put<Announcement>(`/admin/annonces/${id}/archive`);
  return res.data;
}
