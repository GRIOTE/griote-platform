// src/services/announcement.service.ts
import api from '../lib/axios';
import {
  Announcement,
  AnnouncementImage,
  CreateAnnouncementData,
  UpdateAnnouncementData,
} from '../types/announcement';

/* ===========================
   PUBLIC
=========================== */

export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  const res = await api.get<Announcement[]>('/annonces');
  return res.data;
}

export async function getAnnouncementById(
  id: number
): Promise<Announcement> {
  const res = await api.get<Announcement>(`/annonces/${id}`);
  return res.data;
}

/* ===========================
   ADMIN
=========================== */

export async function getAllAnnouncementsForAdmin(): Promise<Announcement[]> {
  const res = await api.get<Announcement[]>('/admin/annonces');
  return res.data;
}

export async function createAnnouncement(
  data: CreateAnnouncementData
): Promise<Announcement> {
  const res = await api.post<Announcement>('/admin/annonces', data);
  return res.data;
}

export async function updateAnnouncement(
  id: number,
  data: UpdateAnnouncementData
): Promise<Announcement> {
  const res = await api.put<Announcement>(
    `/admin/annonces/${id}`,
    data
  );
  return res.data;
}

export async function deleteAnnouncement(id: number): Promise<void> {
  await api.delete(`/admin/annonces/${id}`);
}

export async function publishAnnouncement(
  id: number
): Promise<Announcement> {
  const res = await api.put<Announcement>(
    `/admin/annonces/${id}/publish`
  );
  return res.data;
}

export async function archiveAnnouncement(
  id: number
): Promise<Announcement> {
  const res = await api.put<Announcement>(
    `/admin/annonces/${id}/archive`
  );
  return res.data;
}

/* ===========================
   IMAGE UPLOAD
=========================== */

export async function uploadAnnouncementImage(
  file: File,
  description?: string
): Promise<AnnouncementImage> {
  const formData = new FormData();
  formData.append('file', file);
  if (description) {
    formData.append('description', description);
  }

  const res = await api.post<AnnouncementImage>(
    '/admin/annonces/images',
    formData
  );

  return res.data;
}
