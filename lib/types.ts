// Knak API Types based on OpenAPI specification

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  name: string;
  type: 'email' | 'landing';
  status: string;
  campaign_id: string;
  theme_id?: string;
  brand_id?: string;
  folder_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: User;
  thumbnail_url?: string;
}

export interface Theme {
  id: string;
  name: string;
  type: 'email' | 'landing';
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AssetFolder {
  id: string;
  name: string;
  parent_folder_id?: string;
  brand_id: string;
  created_at: string;
  updated_at: string;
}

export interface AssetCustomFieldset {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface AvailablePlatform {
  id: string;
  name: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface MergeTag {
  id: string;
  name: string;
  code: string;
  platform_id: string;
  created_at: string;
  updated_at: string;
}

export interface SyncStatus {
  id: string;
  asset_id: string;
  platform_id: string;
  status: 'pending' | 'success' | 'failed';
  error_message?: string;
  synced_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TranslationRequest {
  id: string;
  asset_id: string;
  source_language: string;
  target_language: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiError {
  errors: Array<{
    title: string;
    detail: string;
  }>;
}
