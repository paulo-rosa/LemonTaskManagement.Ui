import { observer } from 'mobx-react-lite';
import { Navigate, useLocation } from 'react-router-dom';
import { authStore } from '../stores';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = observer(({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!authStore.isAuthenticated) {
    // Redirect to login but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
});
