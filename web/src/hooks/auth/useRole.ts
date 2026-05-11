import { useAuth } from '@/src/contexts/AuthContext';

export function useRole() {
  const { user } = useAuth();
  const isAdmin    = user?.role === 'admin';
  const isOperator = user?.role === 'operator';

  return { isAdmin, isOperator, role: user?.role ?? null };
}
