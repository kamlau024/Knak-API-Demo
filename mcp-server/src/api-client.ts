import createClient, { type Middleware } from 'openapi-fetch';
import type { paths } from './generated/api-types.js';

const API_BASE_URL = 'https://enterprise.knak.io/api/published/v1';

export interface ApiClientConfig {
  apiToken: string;
  baseUrl?: string;
}

export class KnakApiClient {
  private client: ReturnType<typeof createClient<paths>>;
  private apiToken: string;

  constructor(config: ApiClientConfig) {
    this.apiToken = config.apiToken;

    // Create authentication middleware
    const authMiddleware: Middleware = {
      async onRequest({ request }) {
        request.headers.set('Authorization', `Bearer ${config.apiToken}`);
        return request;
      },
    };

    // Initialize the client with the base URL and middleware
    this.client = createClient<paths>({
      baseUrl: config.baseUrl || API_BASE_URL,
    });

    this.client.use(authMiddleware);
  }

  // Generic method to call any endpoint
  async callEndpoint<P extends keyof paths, M extends keyof paths[P]>(
    path: P,
    method: M,
    options?: any
  ): Promise<any> {
    const methodLower = (method as string).toLowerCase() as 'get' | 'post' | 'patch' | 'delete' | 'put';

    // @ts-ignore - Dynamic method access
    const result = await this.client[methodLower](path, options);

    if (result.error) {
      throw new Error(
        result.error?.errors?.[0]?.detail ||
        JSON.stringify(result.error) ||
        'API request failed'
      );
    }

    return result.data;
  }

  // Convenience methods for common operations

  // Users
  async getUsers(params?: { page?: number; per_page?: number; filter?: { email?: string }; sort?: string }) {
    return this.callEndpoint('/users', 'get', { params: { query: params } });
  }

  async getUser(userId: string) {
    return this.callEndpoint('/users/{user_id}', 'get', { params: { path: { user_id: userId } } });
  }

  async deleteUser(userId: string, reassignTo?: string) {
    return this.callEndpoint('/users/{user_id}', 'delete', {
      params: {
        path: { user_id: userId },
        query: reassignTo ? { user_to_reassign: reassignTo } : undefined
      }
    });
  }

  // Assets
  async getAssets(params?: { page?: number; per_page?: number; filter?: { parent_asset_id?: string } }) {
    return this.callEndpoint('/assets', 'get', { params: { query: params } });
  }

  async createAsset(data: any) {
    return this.callEndpoint('/assets', 'post', { body: data });
  }

  async getAsset(assetId: string) {
    return this.callEndpoint('/assets/{asset_id}', 'get', { params: { path: { asset_id: assetId } } });
  }

  async getAssetContent(assetId: string, platform?: string) {
    return this.callEndpoint('/assets/{asset_id}/content', 'get', {
      params: {
        path: { asset_id: assetId },
        query: platform ? { platform } : undefined
      }
    });
  }

  async getAssetCustomFields(assetId: string) {
    return this.callEndpoint('/assets/{asset_id}/custom-fields', 'get', {
      params: { path: { asset_id: assetId } }
    });
  }

  async updateAssetCustomFields(assetId: string, fields: any) {
    return this.callEndpoint('/assets/{asset_id}/custom-fields', 'patch', {
      params: { path: { asset_id: assetId } },
      body: { asset_custom_fields: fields }
    });
  }

  // Project Management
  async getProjectManagementLink(assetId: string) {
    return this.callEndpoint('/assets/{asset_id}/project-management-link', 'get', {
      params: { path: { asset_id: assetId } }
    });
  }

  async updateProjectManagementLink(assetId: string, data: any) {
    return this.callEndpoint('/assets/{asset_id}/project-management-link', 'patch', {
      params: { path: { asset_id: assetId } },
      body: data
    });
  }

  async deleteProjectManagementLink(assetId: string) {
    return this.callEndpoint('/assets/{asset_id}/project-management-link', 'delete', {
      params: { path: { asset_id: assetId } }
    });
  }

  // Themes
  async getThemes(params?: { page?: number; per_page?: number; filter?: any; sort?: string }) {
    return this.callEndpoint('/themes', 'get', { params: { query: params } });
  }

  async getTheme(themeId: string) {
    return this.callEndpoint('/themes/{theme_id}', 'get', { params: { path: { theme_id: themeId } } });
  }

  // Brands
  async getBrands(params?: { page?: number; per_page?: number; sort?: string }) {
    return this.callEndpoint('/brands', 'get', { params: { query: params } });
  }

  // Asset Folders
  async getAssetFolders(params?: { page?: number; per_page?: number; filter?: any }) {
    return this.callEndpoint('/asset-folders', 'get', { params: { query: params } });
  }

  async createAssetFolder(data: any) {
    return this.callEndpoint('/asset-folders', 'post', { body: data });
  }

  async updateAssetFolder(folderId: string, data: any) {
    return this.callEndpoint('/asset-folders/{asset_folder_id}', 'patch', {
      params: { path: { asset_folder_id: folderId } },
      body: data
    });
  }

  async deleteAssetFolder(folderId: string) {
    return this.callEndpoint('/asset-folders/{asset_folder_id}', 'delete', {
      params: { path: { asset_folder_id: folderId } }
    });
  }

  // Asset Custom Fieldsets
  async getAssetCustomFieldsets(params?: { page?: number; per_page?: number }) {
    return this.callEndpoint('/asset-custom-fieldsets', 'get', { params: { query: params } });
  }

  async getAssetCustomFieldsInFieldset(fieldsetId: string) {
    return this.callEndpoint('/asset-custom-fieldsets/{asset_custom_fieldset_id}/asset-custom-fields', 'get', {
      params: { path: { asset_custom_fieldset_id: fieldsetId } }
    });
  }

  // Available Platforms
  async getAvailablePlatforms(params?: { page?: number; per_page?: number }) {
    return this.callEndpoint('/available-platforms', 'get', { params: { query: params } });
  }

  // Merge Tags
  async getMergeTags(params?: { page?: number; per_page?: number; filter?: any }) {
    return this.callEndpoint('/merge-tags', 'get', { params: { query: params } });
  }

  async createMergeTag(data: any) {
    return this.callEndpoint('/merge-tags', 'post', { body: data });
  }

  async getMergeTag(mergeTagId: string) {
    return this.callEndpoint('/merge-tags/{merge_tag_id}', 'get', {
      params: { path: { merge_tag_id: mergeTagId } }
    });
  }

  async updateMergeTag(mergeTagId: string, data: any) {
    return this.callEndpoint('/merge-tags/{merge_tag_id}', 'patch', {
      params: { path: { merge_tag_id: mergeTagId } },
      body: data
    });
  }

  async deleteMergeTag(mergeTagId: string) {
    return this.callEndpoint('/merge-tags/{merge_tag_id}', 'delete', {
      params: { path: { merge_tag_id: mergeTagId } }
    });
  }

  // Sync Statuses
  async getSyncStatus(syncStatusId: string) {
    return this.callEndpoint('/sync-statuses/{sync_status_id}', 'get', {
      params: { path: { sync_status_id: syncStatusId } }
    });
  }

  async updateSyncStatus(syncStatusId: string, data: any) {
    return this.callEndpoint('/sync-statuses/{sync_status_id}', 'patch', {
      params: { path: { sync_status_id: syncStatusId } },
      body: data
    });
  }

  // Translation Requests
  async getTranslationRequests(params?: { page?: number; per_page?: number; filter?: any; sort?: string }) {
    return this.callEndpoint('/translation-requests', 'get', { params: { query: params } });
  }

  async getTranslationRequest(id: string) {
    return this.callEndpoint('/translation-requests/{id}', 'get', {
      params: { path: { id } }
    });
  }

  async updateTranslationRequest(id: string, data: any) {
    return this.callEndpoint('/translation-requests/{id}', 'patch', {
      params: { path: { id } },
      body: data
    });
  }

  async downloadTranslationSource(id: string, format?: string) {
    return this.callEndpoint('/translation-requests/{id}/download-source', 'get', {
      params: {
        path: { id },
        query: format ? { format } : undefined
      }
    });
  }

  async uploadTranslation(id: string, file: any) {
    return this.callEndpoint('/translation-requests/{id}/upload-translation', 'post', {
      params: { path: { id } },
      body: { file }
    });
  }
}
