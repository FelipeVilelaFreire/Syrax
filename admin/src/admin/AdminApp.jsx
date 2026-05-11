import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import AdminLayout from './shared/layout/AdminLayout';
import Spinner from './shared/components/ui/Spinner';
import { LoginPage } from './apps/auth';
import { DashboardPage } from './apps/dashboard';
import { CompaniesList, CompanyAdd, CompanyDetail } from './apps/companies/pages';
import { UsersList, UserAdd, UserDetail } from './apps/users/pages';

function ProtectedShell() {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.is_superuser) return <Navigate to="/login" replace />;
  return <AdminLayout />;
}

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/companies" element={<CompaniesList />} />
        <Route path="/companies/new" element={<CompanyAdd />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/new" element={<UserAdd />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
