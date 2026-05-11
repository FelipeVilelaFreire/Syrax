'use client';
import { useState, useEffect, useCallback } from 'react';
import { leadService } from '@/src/services/leadService';
import { getErrorMessage } from '@/src/lib/errors';

type DateRange = '7d' | '30d' | '90d';

interface WeeklyBar {
  week: string;
  leads: number;
  conversoes: number;
}

export function useRelatoriosScreen() {
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [weeklyData, setWeeklyData] = useState<WeeklyBar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [allLeads, converted] = await Promise.all([
        leadService.list({ page_size: 100 }),
        leadService.list({ status: 'convertido', page_size: 100 }),
      ]);

      // Group into 8 weekly buckets
      const weeks: WeeklyBar[] = Array.from({ length: 8 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (7 - i) * 7);
        return {
          week: `S${i + 1}`,
          leads: 0,
          conversoes: 0,
        };
      });

      setWeeklyData(weeks);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { refresh(); }, [refresh]);

  return { dateRange, setDateRange, weeklyData, loading, error, refresh };
}
