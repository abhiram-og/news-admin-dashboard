import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { useAuthStore } from '@/contexts/AuthContext';

function AppBootstrap() {
  useEffect(() => {
    useAuthStore.getState().initializeAuth();
  }, []);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppBootstrap />
  </React.StrictMode>
);
