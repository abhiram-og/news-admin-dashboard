import { api, uploadApi } from "@/api/axios";

import type { 
  Article, 
  ArticleFormData, 
  ApiResponse, 
  PaginatedResponse,
  PublishStatus 
} from '@/types';

interface ArticleFilters {
  publish_status?: PublishStatus;
  category?: number;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export const articlesApi = {
  // List articles
  list: async (filters: ArticleFilters = {}): Promise<PaginatedResponse<Article>> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await api.get<ApiResponse<PaginatedResponse<Article>>>(
      `/admin/articles/?${params.toString()}`
    );
    return response.data.data;
  },

  // Get single article
  get: async (id: number): Promise<Article> => {
    const response = await api.get<ApiResponse<Article>>(`/admin/articles/${id}/`);
    return response.data.data;
  },

  // Create article
  create: async (data: ArticleFormData): Promise<Article> => {
    const formData = new FormData();
    
    // Append all fields
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'featured_image' && value instanceof File) {
          formData.append(key, value);
        } else if (key === 'category_id') {
          formData.append('category_id', String(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await uploadApi.post<ApiResponse<Article>>('/admin/articles/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update article
  update: async (id: number, data: Partial<ArticleFormData>): Promise<Article> => {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'featured_image' && value instanceof File) {
          formData.append(key, value);
        } else if (key === 'category_id') {
          formData.append('category_id', String(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await uploadApi.patch<ApiResponse<Article>>(`/admin/articles/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // Update article status (publish/unpublish/archive)
  updateStatus: async (id: number, status: PublishStatus): Promise<Article> => {
    const response = await api.patch<ApiResponse<Article>>(
      `/admin/articles/${id}/status/`,
      { publish_status: status }
    );
    return response.data.data;
  },

  // Delete article
  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/articles/${id}/`);
  },
};
