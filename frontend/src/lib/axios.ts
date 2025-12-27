import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // pour cookie httpOnly
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshRes = await instance.post("/auth/refresh");
        localStorage.setItem("accessToken", refreshRes.data.accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${refreshRes.data.accessToken}`;
        return instance(originalRequest);
      } catch {
        window.location.href = "/connexion";
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
