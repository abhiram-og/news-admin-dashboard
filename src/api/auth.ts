import { api } from './axios';
import type { 
  LoginCredentials, 
  LoginResponse, 
  ApiResponse,
  User 
} from '@/types';

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login/', credentials);
    return response.data;
  },

  // Refresh token
  refresh: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await api.post<ApiResponse<{ access: string }>>('/auth/refresh/', {
      refresh: refreshToken,
    });
    return response.data.data;
  },

  // Logout
  logout: async (refreshToken: string): Promise<void> => {
    await api.post('/auth/logout/', { refresh: refreshToken });
  },

  // Get profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile/');
    return response.data.data;
  },

  // Change password
  changePassword: async (data: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<void> => {
    await api.post('/auth/change-password/', data);
  },
};
