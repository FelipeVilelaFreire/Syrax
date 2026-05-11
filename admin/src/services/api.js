import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8001/api';
const ACCESS_KEY = 'admin_access_token';
const REFRESH_KEY = 'admin_refresh_token';

export const auth = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  setTokens: (access, refresh) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = auth.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      const refresh = auth.getRefresh();
      if (refresh) {
        try {
          const res = await axios.post(`${API_URL}/users/token/refresh/`, { refresh });
          localStorage.setItem(ACCESS_KEY, res.data.access);
          err.config.headers.Authorization = `Bearer ${res.data.access}`;
          return api(err.config);
        } catch {
          auth.clear();
          window.location.href = '/login';
        }
      } else {
        auth.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  },
);

export function getErrorMessage(err) {
  const data = err?.response?.data;
  if (typeof data === 'string') return data;
  if (data?.detail) return data.detail;
  if (data && typeof data === 'object') {
    const first = Object.values(data)[0];
    return Array.isArray(first) ? first[0] : String(first);
  }
  return 'Algo deu errado. Tente novamente.';
}
