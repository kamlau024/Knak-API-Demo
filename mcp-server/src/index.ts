#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { KnakApiClient } from './api-client.js';
import manifest from './manifest.json' with { type: 'json' };

// Tool name to API client method mapping
const TOOL_TO_METHOD_MAP: Record<string, { method: string; paramMapping?: (args: any) => any }> = {
  // Users
  get_users: { method: 'getUsers', paramMapping: (args) => [args] },
  get_usersByUserId: { method: 'getUser', paramMapping: (args) => [args.user_id] },
  delete_usersByUserId: { method: 'deleteUser', paramMapping: (args) => [args.user_id, args.user_to_reassign] },

  // Assets
  get_assets: { method: 'getAssets', paramMapping: (args) => [args] },
  post_assets: { method: 'createAsset', paramMapping: (args) => [args] },
  get_assetsByAssetId: { method: 'getAsset', paramMapping: (args) => [args.asset_id] },
  get_assetsByAssetIdContent: { method: 'getAssetContent', paramMapping: (args) => [args.asset_id, args.platform] },
  get_assetsByAssetIdCustomFields: { method: 'getAssetCustomFields', paramMapping: (args) => [args.asset_id] },
  patch_assetsByAssetIdCustomFields: { method: 'updateAssetCustomFields', paramMapping: (args) => [args.asset_id, args.asset_custom_fields] },

  // Project Management
  get_assetsByAssetIdProjectManagementLink: { method: 'getProjectManagementLink', paramMapping: (args) => [args.asset_id] },
  patch_assetsByAssetIdProjectManagementLink: { method: 'updateProjectManagementLink', paramMapping: (args) => [args.asset_id, args] },
  delete_assetsByAssetIdProjectManagementLink: { method: 'deleteProjectManagementLink', paramMapping: (args) => [args.asset_id] },

  // Themes
  get_themes: { method: 'getThemes', paramMapping: (args) => [args] },
  get_themesByThemeId: { method: 'getTheme', paramMapping: (args) => [args.theme_id] },

  // Brands
  get_brands: { method: 'getBrands', paramMapping: (args) => [args] },

  // Asset Folders
  get_assetFolders: { method: 'getAssetFolders', paramMapping: (args) => [args] },
  post_assetFolders: { method: 'createAssetFolder', paramMapping: (args) => [args] },
  patch_assetFoldersByAssetFolderId: { method: 'updateAssetFolder', paramMapping: (args) => [args.asset_folder_id, args] },
  delete_assetFoldersByAssetFolderId: { method: 'deleteAssetFolder', paramMapping: (args) => [args.asset_folder_id] },

  // Asset Custom Fieldsets
  get_assetCustomFieldsets: { method: 'getAssetCustomFieldsets', paramMapping: (args) => [args] },
  get_assetCustomFieldsetsByAssetCustomFieldsetIdAssetCustomFields: {
    method: 'getAssetCustomFieldsInFieldset',
    paramMapping: (args) => [args.asset_custom_fieldset_id]
  },

  // Available Platforms
  get_availablePlatforms: { method: 'getAvailablePlatforms', paramMapping: (args) => [args] },

  // Merge Tags
  get_mergeTags: { method: 'getMergeTags', paramMapping: (args) => [args] },
  post_mergeTags: { method: 'createMergeTag', paramMapping: (args) => [args] },
  get_mergeTagsByMergeTagId: { method: 'getMergeTag', paramMapping: (args) => [args.merge_tag_id] },
  patch_mergeTagsByMergeTagId: { method: 'updateMergeTag', paramMapping: (args) => [args.merge_tag_id, args] },
  delete_mergeTagsByMergeTagId: { method: 'deleteMergeTag', paramMapping: (args) => [args.merge_tag_id] },

  // Sync Statuses
  get_syncStatusesBySyncStatusId: { method: 'getSyncStatus', paramMapping: (args) => [args.sync_status_id] },
  patch_syncStatusesBySyncStatusId: { method: 'updateSyncStatus', paramMapping: (args) => [args.sync_status_id, args] },

  // Translation Requests
  get_translationRequests: { method: 'getTranslationRequests', paramMapping: (args) => [args] },
  get_translationRequestsById: { method: 'getTranslationRequest', paramMapping: (args) => [args.id] },
  patch_translationRequestsById: { method: 'updateTranslationRequest', paramMapping: (args) => [args.id, args] },
  get_translationRequestsByIdDownloadSource: { method: 'downloadTranslationSource', paramMapping: (args) => [args.id, args.format] },
  post_translationRequestsByIdUploadTranslation: { method: 'uploadTranslation', paramMapping: (args) => [args.id, args.file] },
};

class KnakMCPServer {
  private server: Server;
  private apiClient: KnakApiClient | null = null;

  constructor() {
    this.server = new Server(
      {
        name: 'knak-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: manifest.tools.map((tool) => ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        })) as Tool[],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name: toolName, arguments: args } = request.params;

      if (!this.apiClient) {
        // Initialize API client with token from environment or args
        const apiToken = process.env.KNAK_API_TOKEN || (args as any)?._apiToken;

        if (!apiToken) {
          return {
            content: [{
              type: 'text',
              text: JSON.stringify({
                error: 'API token not configured. Please set KNAK_API_TOKEN environment variable or pass _apiToken in arguments.',
              }),
            }],
          };
        }

        this.apiClient = new KnakApiClient({ apiToken });
      }

      // Find the mapping for this tool
      const mapping = TOOL_TO_METHOD_MAP[toolName];

      if (!mapping) {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: `Unknown tool: ${toolName}`,
            }),
          }],
        };
      }

      try {
        // Get the method from the API client
        const method = (this.apiClient as any)[mapping.method];

        if (!method || typeof method !== 'function') {
          throw new Error(`Method ${mapping.method} not found on API client`);
        }

        // Map arguments to method parameters
        const methodArgs = mapping.paramMapping
          ? mapping.paramMapping(args)
          : [args];

        // Call the API method
        const result = await method.apply(this.apiClient, methodArgs);

        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2),
          }],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              error: errorMessage,
              tool: toolName,
            }),
          }],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.error('Knak MCP Server running on stdio');
    console.error(`Available tools: ${manifest.tools.length}`);
  }
}

// Start the server
const server = new KnakMCPServer();
server.run().catch(console.error);
