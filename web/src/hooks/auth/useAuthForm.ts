'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/src/services/authService';
import { getErrorMessage } from '@/src/lib/errors';
import { ROUTES } from '@/src/constants/routes';
import type { LoginData } from '@/src/types/user';

export function useLoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<LoginData>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setField = useCallback(<K extends keyof LoginData>(key: K, value: LoginData[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.login(form);
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [form, router]);

  return { form, error, isLoading, setField, handleSubmit };
}
