import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, auth } from '@/services/api';
import { API_ENDPOINTS } from '@/admin/ini/config/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!auth.getAccess()) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(API_ENDPOINTS.ME);
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    auth.setTokens(res.data.access, res.data.refresh);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  const logout = useCallback(() => {
    auth.clear();
    setUser(null);
    window.location.href = '/login';
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
