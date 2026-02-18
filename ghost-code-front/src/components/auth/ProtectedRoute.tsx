import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
  const { token, user, isLoading } = useAuthStore();
  const isAuthenticated = !!token;

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;