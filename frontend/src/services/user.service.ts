// src/services/mon-compte.service.ts
import api from '../lib/axios';
import type { User } from './auth.service';

// Récupérer le profil de l'utilisateur connecté
export async function getProfile(): Promise<User> {
  const res = await api.get<User>('/users/me');
  return res.data;
}

// Mettre à jour le profil
export async function updateProfile(data: Partial<User>): Promise<User> {
  const res = await api.put<User>('/users/me', data);
  return res.data;
}

// Changer le mot de passe
export async function changePassword(data: { oldPassword: string; newPassword: string }): Promise<any> {
  const res = await api.post<User>('/users/me/change-password', data);
  return res.data;
}

// Uploader une photo de profil
export async function setProfilePicture(formData: FormData): Promise<any> {
  const res = await api.post('/users/me/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

// Supprimer la photo de profil
export async function removeProfilePicture(): Promise<any> {
  const res = await api.delete('/users/me/profile-picture');
  return res.data;
}

// Supprimer son propre compte
export async function deleteAccount(): Promise<any> {
  const res = await api.delete('/users/me');
  return res.data;
}
