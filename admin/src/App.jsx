import { AuthProvider } from './admin/contexts/AuthContext';
import { ToastProvider } from './admin/contexts/ToastContext';
import AdminApp from './admin/AdminApp';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminApp />
      </ToastProvider>
    </AuthProvider>
  );
}
