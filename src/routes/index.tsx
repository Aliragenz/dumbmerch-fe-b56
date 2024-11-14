// src/router/AppRouter.tsx
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Index from '../auth/components/Index';
import DashboardCustomer from '../components/customer/dashboard';
import DashboardAdmin from '../components/admin/admin-dashboard';
import LogoutComponent from '../auth/components/logout';
import { useAuth } from '../context/authContext';
import { CircularProgress } from '@mui/material';

export function AppRouter() {
  const { loading, isAuthenticated, userRole } = useAuth();

  const router = createBrowserRouter([
    {
      path: '/',
      element: loading ? <CircularProgress style={{ display: 'block', margin: 'auto' }} /> : <Index />
    },
    {
      path: '/admin/*',
      element: loading ? (
        <CircularProgress style={{ display: 'block', margin: 'auto' }} />
      ) : (
        isAuthenticated && userRole === 'ADMIN' ? <DashboardAdmin /> : <Navigate to="/" />
      )
    },
    {
      path: '/customer/*',
      element: loading ? (
        <CircularProgress style={{ display: 'block', margin: 'auto' }} />
      ) : (
        isAuthenticated && userRole === 'CUSTOMER' ? <DashboardCustomer /> : <Navigate to="/" />
      )
    },
    {
      path: '/logout',
      element: <LogoutComponent />
    },
  ]);

  return (
    <div>
      {loading ? (
        <CircularProgress style={{ display: 'block', margin: 'auto' }} />
      ) : (
        <RouterProvider router={router} />
      )}
    </div>
  );
}
