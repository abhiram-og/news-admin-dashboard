import { api } from './axios';
import type { 
  Category, 
  CategoryFormData, 
  ApiResponse, 
  PaginatedResponse 
} from '@/types';

interface CategoryFilters {
  search?: string;
  page?: number;
  page_size?: number;
}

export const categoriesApi = {
  // List categories
  list: async (filters: CategoryFilters = {}): Promise<PaginatedResponse<Category>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await api.get<ApiResponse<PaginatedResponse<Category>>>(
      `/admin/categories/?${params.toString()}`
    );
    return response.data.data;
  },

  // Get all categories (for dropdown)
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Category>>>(
      '/admin/categories/?page_size=100'
    );
    return response.data.data.results;
  },

  // Get single category
  get: async (id: number): Promise<Category> => {
    const response = await api.get<ApiResponse<Category>>(`/admin/categories/${id}/`);
    return response.data.data;
  },

  // Create category
  create: async (data: CategoryFormData): Promise<Category> => {
    const response = await api.post<ApiResponse<Category>>('/admin/categories/', data);
    return response.data.data;
  },

  // Update category
  update: async (id: number, data: Partial<CategoryFormData>): Promise<Category> => {
    const response = await api.patch<ApiResponse<Category>>(`/admin/categories/${id}/`, data);
    return response.data.data;
  },

  // Delete category
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/categories/${id}/`);
  },
};
