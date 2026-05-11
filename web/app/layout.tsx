import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/src/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'SYRAX — Revenue Intelligence',
  description: 'Plataforma B2B de inteligência de vendas para recuperação de receita.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
