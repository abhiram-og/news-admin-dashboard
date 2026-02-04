import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ArticlesPage } from '@/pages/articles/ArticlesPage';
import { ArticleFormPage } from '@/pages/articles/ArticleFormPage';
import { CategoriesPage } from '@/pages/categories/CategoriesPage';
import { UsersPage } from '@/pages/users/UsersPage';
import { ProfilePage } from '@/pages/ProfilePage';

// Protected route wrapper
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Admin-only route wrapper
function AdminRoute() {
  const { isAuthenticated, isLoading, isAdmin } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

// Public route (redirects to dashboard if authenticated)
function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/articles',
            element: <ArticlesPage />,
          },
          {
            path: '/articles/new',
            element: <ArticleFormPage />,
          },
          {
            path: '/articles/:id/edit',
            element: <ArticleFormPage />,
          },
          {
            path: '/categories',
            element: <CategoriesPage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/users',
            element: <UsersPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
