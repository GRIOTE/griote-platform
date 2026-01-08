// src/types/announcement.ts

export type AnnouncementStatus = 'pending' | 'published' | 'archived';

export interface AnnouncementImage {
  id: number;
  url: string;
  description?: string;
}

export interface AnnouncementAuthor {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Announcement {
  announcement_id: number;
  author_id: number;

  titre: string;
  contenu: string;

  statut: AnnouncementStatus;

  date_creation: string;
  date_publication: string | null;

  image_apercu_id: number | null;
  previewImage: AnnouncementImage | null;

  images?: AnnouncementImage[];
  author?: AnnouncementAuthor;
}

export interface CreateAnnouncementData {
  titre: string;
  contenu: string;
  image_apercu_id?: number | null;
}

export interface UpdateAnnouncementData {
  titre?: string;
  contenu?: string;
  image_apercu_id?: number | null;
}
