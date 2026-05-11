export const formatBRL = (value: number | string): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));

export const formatPercent = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'percent', minimumFractionDigits: 1 }).format(value / 100);

export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatHoursAgo = (hours: number): string => {
  if (hours < 1) return 'Agora';
  if (hours < 24) return `${Math.round(hours)}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
};
