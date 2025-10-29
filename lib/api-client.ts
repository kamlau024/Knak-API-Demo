import type {
  User,
  Asset,
  Theme,
  Brand,
  AssetFolder,
  AssetCustomFieldset,
  AvailablePlatform,
  MergeTag,
  SyncStatus,
  TranslationRequest,
  PaginatedResponse,
} from './types';

const API_BASE_URL = 'https://enterprise.knak.io/api/published/v1';

// This would normally come from environment variables or user authentication
let apiToken: string | null = null;

export function setApiToken(token: string) {
  apiToken = token;
}

export function getApiToken(): string | null {
  return apiToken;
}

class KnakApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = getApiToken();

    if (!token) {
      throw new Error('API token not set. Please configure your authentication.');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.detail || 'API request failed');
    }

    return response.json();
  }

  // User endpoints
  async getUsers(params?: {
    page?: number;
    per_page?: number;
    filter?: { email?: string };
    sort?: string;
  }): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.filter?.email) queryParams.append('filter[email]', params.filter.email);
    if (params?.sort) queryParams.append('sort', params.sort);

    const query = queryParams.toString();
    return this.request<PaginatedResponse<User>>(
      `/users${query ? `?${query}` : ''}`
    );
  }

  async getUser(userId: string): Promise<{ data: User }> {
    return this.request<{ data: User }>(`/users/${userId}`);
  }

  async deleteUser(userId: string, reassignTo?: string): Promise<{ message: string }> {
    const query = reassignTo ? `?user_to_reassign=${reassignTo}` : '';
    return this.request<{ message: string }>(`/users/${userId}${query}`, {
      method: 'DELETE',
    });
  }

  // Asset endpoints
  async getAssets(params?: {
    page?: number;
    per_page?: number;
    filter?: { parent_asset_id?: string };
  }): Promise<PaginatedResponse<Asset>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.filter?.parent_asset_id) {
      queryParams.append('filter[parent_asset_id]', params.filter.parent_asset_id);
    }

    const query = queryParams.toString();
    return this.request<PaginatedResponse<Asset>>(
      `/assets${query ? `?${query}` : ''}`
    );
  }

  async getAsset(assetId: string): Promise<{ data: Asset }> {
    return this.request<{ data: Asset }>(`/assets/${assetId}`);
  }

  async createAsset(data: {
    name: string;
    type: 'email' | 'landing';
    campaign_id: string;
    theme_id?: string;
    brand_id?: string;
    folder_id?: string;
  }): Promise<{ data: Asset }> {
    return this.request<{ data: Asset }>('/assets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAssetContent(assetId: string, platform?: string): Promise<{ data: Asset & { html: string } }> {
    const query = platform ? `?platform=${platform}` : '';
    return this.request<{ data: Asset & { html: string } }>(`/assets/${assetId}/content${query}`);
  }

  async getAssetCustomFields(assetId: string): Promise<{ data: Array<{ key: string; value: string }> }> {
    return this.request<{ data: Array<{ key: string; value: string }> }>(`/assets/${assetId}/custom-fields`);
  }

  async updateAssetCustomFields(
    assetId: string,
    fields: Array<{ key: string; value: string }>
  ): Promise<{ data: Array<{ key: string; value: string }> }> {
    return this.request<{ data: Array<{ key: string; value: string }> }>(
      `/assets/${assetId}/custom-fields`,
      {
        method: 'PATCH',
        body: JSON.stringify({ asset_custom_fields: fields }),
      }
    );
  }

  // Theme endpoints
  async getThemes(params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Theme>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const query = queryParams.toString();
    return this.request<PaginatedResponse<Theme>>(
      `/themes${query ? `?${query}` : ''}`
    );
  }

  async getTheme(themeId: string): Promise<{ data: Theme }> {
    return this.request<{ data: Theme }>(`/themes/${themeId}`);
  }

  // Brand endpoints
  async getBrands(params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Brand>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const query = queryParams.toString();
    return this.request<PaginatedResponse<Brand>>(
      `/brands${query ? `?${query}` : ''}`
    );
  }

  // Asset Folder endpoints
  async getAssetFolders(params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<AssetFolder>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const query = queryParams.toString();
    return this.request<PaginatedResponse<AssetFolder>>(
      `/asset-folders${query ? `?${query}` : ''}`
    );
  }

  // Asset Custom Fieldset endpoints
  async getAssetCustomFieldsets(params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<AssetCustomFieldset>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const query = queryParams.toString();
    return this.request<PaginatedResponse<AssetCustomFieldset>>(
      `/asset-custom-fieldsets${query ? `?${query}` : ''}`
    );
  }

  // Available Platform endpoints
  async getAvailablePlatforms(params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<AvailablePlatform>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const query = queryParams.toString();
    return this.request<PaginatedResponse<AvailablePlatform>>(
      `/available-platforms${query ? `?${query}` : ''}`
    );
  }

  // Merge Tag endpoints
  async getMergeTags(params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<MergeTag>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const query = queryParams.toString();
    return this.request<PaginatedResponse<MergeTag>>(
      `/merge-tags${query ? `?${query}` : ''}`
    );
  }

  async getMergeTag(mergeTagId: string): Promise<{ data: MergeTag }> {
    return this.request<{ data: MergeTag }>(`/merge-tags/${mergeTagId}`);
  }

  // Sync Status endpoints
  async getSyncStatus(syncStatusId: string): Promise<{ data: SyncStatus }> {
    return this.request<{ data: SyncStatus }>(`/sync-statuses/${syncStatusId}`);
  }

  // Translation Request endpoints
  async getTranslationRequests(params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<TranslationRequest>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());

    const query = queryParams.toString();
    return this.request<PaginatedResponse<TranslationRequest>>(
      `/translation-requests${query ? `?${query}` : ''}`
    );
  }

  async getTranslationRequest(id: string): Promise<{ data: TranslationRequest }> {
    return this.request<{ data: TranslationRequest }>(`/translation-requests/${id}`);
  }

  async createTranslationRequest(data: {
    asset_id: string;
    source_language: string;
    target_language: string;
  }): Promise<{ data: TranslationRequest }> {
    return this.request<{ data: TranslationRequest }>('/translation-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new KnakApiClient();
