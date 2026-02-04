import { createBrowserRouter, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ArticlesPage } from "@/pages/articles/ArticlesPage";
import { ArticleFormPage } from "@/pages/articles/ArticleFormPage";
import { CategoriesPage } from "@/pages/categories/CategoriesPage";
import { UsersPage } from "@/pages/users/UsersPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },  

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />, // ✅ ONLY ONCE
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/articles", element: <ArticlesPage /> },
          { path: "/articles/new", element: <ArticleFormPage /> },
          { path: "/articles/:id/edit", element: <ArticleFormPage /> },
          { path: "/categories", element: <CategoriesPage /> },
          { path: "/users", element: <UsersPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },

  { path: "/", element: <Navigate to="/dashboard" /> },
]);
