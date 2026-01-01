// src/lib/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // Indispensable pour envoyer/recevoir le cookie httpOnly
});

// Ajoute le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gère le rafraîchissement automatique du token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        // Si le backend renvoie aussi l'user mis à jour (recommandé)
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        // Réessayer la requête originale
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh échoué → déconnexion
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/connexion";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;