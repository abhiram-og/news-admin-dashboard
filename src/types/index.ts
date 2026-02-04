// User Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'admin' | 'editor' | 'user';
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    access: string;
    refresh: string;
    user: User;
  };
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  article_count: number;
  created_at: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

// Article Types
export type PublishStatus = 'draft' | 'published' | 'archived';

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: Category | null;
  author: User;
  featured_image: string | null;
  publish_status: PublishStatus;
  published_at: string | null;
  is_featured: boolean;
  view_count: number;
  reading_time: number;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleFormData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  category_id: number | null;
  featured_image?: File | null;
  publish_status: PublishStatus;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Filter Types
export interface ArticleFilters {
  status?: PublishStatus | 'all';
  category?: number | 'all';
  search?: string;
  ordering?: string;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}
