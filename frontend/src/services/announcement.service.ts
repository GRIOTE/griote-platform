// src/services/announcement.service.ts
import api from '../lib/axios';
import type {
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
  data: CreateAnnouncementData & { image?: File }
): Promise<Announcement> {
  const formData = new FormData();
  formData.append('titre', data.titre);
  formData.append('contenu', data.contenu);
  if (data.image_apercu_id) {
    formData.append('image_apercu_id', data.image_apercu_id.toString());
  }
  if (data.image) {
    formData.append('file', data.image);
  }

  const res = await api.post<Announcement>('/admin/annonces', formData);
  return res.data;
}

export async function updateAnnouncement(
  id: number,
  data: UpdateAnnouncementData & { image?: File }
): Promise<Announcement> {
  const formData = new FormData();
  if (data.titre) formData.append('titre', data.titre);
  if (data.contenu) formData.append('contenu', data.contenu);
  if (data.image_apercu_id) {
    formData.append('image_apercu_id', data.image_apercu_id.toString());
  }
  if (data.image) {
    formData.append('file', data.image);
  }

  const res = await api.put<Announcement>(
    `/admin/annonces/${id}`,
    formData
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
