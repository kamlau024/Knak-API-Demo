# Knak MCP Server

A Model Context Protocol (MCP) server for the Knak Enterprise API, providing LLM-friendly access to all Knak API endpoints.

## Overview

This MCP server automatically generates tools from the Knak OpenAPI specification, allowing Claude and other LLM applications to interact with the Knak API through standardized MCP tools.

## Features

- **Auto-generated from OpenAPI**: All 34 tools are generated directly from the `openapi.yml` specification
- **Type-safe**: Uses TypeScript with generated types from the OpenAPI spec
- **Full API Coverage**: Supports all 10 endpoint groups:
  - Assets Management (7 endpoints)
  - User Management (3 endpoints)
  - Themes (2 endpoints)
  - Brands (1 endpoint)
  - Asset Folders (4 endpoints)
  - Asset Custom Fieldsets (2 endpoints)
  - Available Platforms (1 endpoint)
  - Merge Tags (5 endpoints)
  - Sync Statuses (2 endpoints)
  - Translation Requests (5 endpoints)

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

This will:
1. Compile TypeScript to JavaScript in the `dist/` directory

## Development

### Generate TypeScript Types from OpenAPI

```bash
npm run generate:client
```

This generates type definitions in `src/generated/api-types.ts` from the OpenAPI specification.

### Regenerate MCP Manifest

```bash
npm run generate:manifest
```

This parses the OpenAPI spec and generates `src/manifest.json` containing all MCP tool definitions.

### Development Mode

```bash
npm run dev
```

Runs the server in watch mode with automatic reloading on file changes.

## Usage

### Claude Desktop Configuration

Add the server to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "knak": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"],
      "env": {
        "KNAK_API_TOKEN": "your-knak-api-token-here"
      }
    }
  }
}
```

### Environment Variables

- `KNAK_API_TOKEN` (required): Your Knak Enterprise API token

You can generate an API token from the [Knak Enterprise UI](https://enterprise.knak.io/account/api-access).

### Testing

Once configured, you can test the MCP server in Claude Desktop by asking questions like:

- "List all users in Knak"
- "Get details for asset with ID 609d7ce223411"
- "Create a new merge tag for Marketo"
- "List all available themes"

## Available Tools

The server provides 34 MCP tools, automatically generated from the OpenAPI spec:

### User Management
- `get_users` - List all users with pagination and filtering
- `get_usersByUserId` - Get specific user details
- `delete_usersByUserId` - Delete a user

### Assets Management
- `get_assets` - List all assets
- `post_assets` - Create new asset
- `get_assetsByAssetId` - Get asset details
- `get_assetsByAssetIdContent` - Get asset HTML content
- `get_assetsByAssetIdCustomFields` - Get asset custom fields
- `patch_assetsByAssetIdCustomFields` - Update asset custom fields
- `get_assetsByAssetIdProjectManagementLink` - Get project management link
- `patch_assetsByAssetIdProjectManagementLink` - Update project management link
- `delete_assetsByAssetIdProjectManagementLink` - Delete project management link

### Themes
- `get_themes` - List all themes with filtering
- `get_themesByThemeId` - Get theme details

### Brands
- `get_brands` - List all brands

### Asset Folders
- `get_assetFolders` - List asset folders
- `post_assetFolders` - Create new folder
- `patch_assetFoldersByAssetFolderId` - Update folder
- `delete_assetFoldersByAssetFolderId` - Delete folder

### Asset Custom Fieldsets
- `get_assetCustomFieldsets` - List custom fieldsets
- `get_assetCustomFieldsetsByAssetCustomFieldsetIdAssetCustomFields` - Get fields in fieldset

### Available Platforms
- `get_availablePlatforms` - List available platforms

### Merge Tags
- `get_mergeTags` - List merge tags
- `post_mergeTags` - Create merge tag
- `get_mergeTagsByMergeTagId` - Get merge tag details
- `patch_mergeTagsByMergeTagId` - Update merge tag
- `delete_mergeTagsByMergeTagId` - Delete merge tag

### Sync Statuses
- `get_syncStatusesBySyncStatusId` - Get sync status
- `patch_syncStatusesBySyncStatusId` - Update sync status

### Translation Requests
- `get_translationRequests` - List translation requests
- `get_translationRequestsById` - Get translation request
- `patch_translationRequestsById` - Update translation request
- `get_translationRequestsByIdDownloadSource` - Download source file
- `post_translationRequestsByIdUploadTranslation` - Upload translation

## Architecture

The MCP server consists of:

1. **Manifest Generator** (`src/scripts/generateManifest.ts`): Parses the OpenAPI spec and generates MCP tool definitions
2. **API Client** (`src/api-client.ts`): Type-safe wrapper around the Knak API using `openapi-fetch`
3. **MCP Server** (`src/index.ts`): Handles MCP protocol, tool discovery, and invocation
4. **Generated Types** (`src/generated/api-types.ts`): TypeScript types from OpenAPI spec

## Development Workflow

When the OpenAPI spec changes:

1. Update `../openapi.yml`
2. Regenerate types: `npm run generate:client`
3. Regenerate manifest: `npm run generate:manifest`
4. Rebuild: `npm run build`
5. Restart Claude Desktop to pick up changes

## Error Handling

The server handles common errors:
- Missing or invalid API token
- Unknown tools
- API request failures
- Invalid parameters

All errors are returned as MCP error responses with descriptive messages.

## Contributing

To add support for new endpoints:

1. Update the `../openapi.yml` file
2. Run `npm run generate:client` to update types
3. Run `npm run generate:manifest` to update tools
4. Add method to `src/api-client.ts` if needed
5. Add mapping to `TOOL_TO_METHOD_MAP` in `src/index.ts`
6. Rebuild and test

## License

ISC

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Knak API Documentation](https://enterprise.knak.io/docs/api)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
