# Knak API Explorer

A prototype Next.js application for exploring and interacting with the Knak Enterprise API. This application demonstrates the various API endpoint groups and their use cases in an intuitive, interactive interface.

## Projects in this Repository

This repository contains two projects:

1. **Web Application** - An interactive Next.js application for exploring the Knak API
2. **MCP Server** (`/mcp-server`) - A Model Context Protocol server that provides Claude and other LLMs with access to the Knak API

See [`/mcp-server/README.md`](./mcp-server/README.md) for MCP server documentation.

## About Knak

Knak is a no-code email and landing page builder designed for enterprise marketing teams. It enables teams to create beautiful, on-brand campaigns without requiring coding skills.

**Key Features:**
- No-code drag-and-drop editor
- Enterprise-grade brand control
- Platform integrations (Marketo, Eloqua, Pardot, SFMC)
- AI-powered features
- Collaboration tools

## Application Features

This prototype application provides interactive interfaces for exploring the following Knak API capabilities:

### 1. Dashboard
- Overview of all API capabilities
- Quick links to different sections
- Getting started guide
- Visual feature cards with endpoint information

### 2. Assets Management
**Endpoints:**
- `GET /assets` - List all assets with pagination and filtering
- `POST /assets` - Create new email or landing page assets
- `GET /assets/:id` - Get detailed asset information
- `PATCH /assets/:id/custom-fields` - Update asset custom fields
- `GET /assets/:id/project-management-link` - Get project management integration
- `PATCH /assets/:id/project-management-link` - Update project management link
- `DELETE /assets/:id/project-management-link` - Remove project management link

Browse, create, and manage email and landing page assets. View asset details including type, status, creator, and timestamps. Link assets to external project management systems.

### 3. User Management
**Endpoints:**
- `GET /users` - List all users with pagination and filtering
- `GET /users/:id` - Get specific user details
- `DELETE /users/:id` - Remove user from organization

View and manage users within your Knak organization. Filter users by email and sort by creation date.

### 4. Themes
**Endpoints:**
- `GET /themes` - Browse available themes with filtering and sorting
- `GET /themes/:id` - Get detailed theme information

Browse available themes for creating branded assets. Filter by name, tags, and published status. Themes provide consistent design elements across your marketing materials.

### 5. Brands
**Endpoints:**
- `GET /brands` - List all brands with pagination and sorting

View and manage brand guidelines and settings for your organization.

### 6. Asset Folders
**Endpoints:**
- `POST /asset-folders` - Create new folders or campaigns
- `GET /asset-folders` - List folders with filtering by brand and parent
- `PATCH /asset-folders/:id` - Update folder properties
- `DELETE /asset-folders/:id` - Remove folders

Organize assets hierarchically using folders and campaigns. Filter by brand and navigate folder structures.

### 7. Asset Custom Fieldsets
**Endpoints:**
- `GET /asset-custom-fieldsets` - List all custom fieldsets
- `GET /asset-custom-fieldsets/:id/asset-custom-fields` - Get fields in a fieldset

Manage custom field configurations for assets. Define and retrieve custom metadata schemas.

### 8. Available Platforms
**Endpoints:**
- `GET /available-platforms` - List integrated marketing automation platforms

View marketing automation platforms available for integration with your Knak organization.

### 9. Merge Tags
**Endpoints:**
- `POST /merge-tags` - Create new merge tags
- `GET /merge-tags` - List merge tags with filtering by name and platform
- `GET /merge-tags/:id` - Get specific merge tag details
- `PATCH /merge-tags/:id` - Update merge tag properties
- `DELETE /merge-tags/:id` - Remove merge tags

Manage dynamic content merge tags for personalization. Full CRUD operations with platform-specific filtering.

### 10. Sync Statuses
**Endpoints:**
- `GET /sync-statuses/:id` - Get synchronization status details
- `PATCH /sync-statuses/:id` - Update sync status information

Track and manage synchronization statuses for platform integrations. Monitor sync progress and update results.

### 11. Translation Requests
**Endpoints:**
- `GET /translation-requests` - List translation requests with advanced filtering
- `GET /translation-requests/:id` - Get specific translation request
- `PATCH /translation-requests/:id` - Update translation request status
- `GET /translation-requests/:id/download-source` - Download source file in multiple formats
- `POST /translation-requests/:id/upload-translation` - Upload completed translation

Request and manage asset translations across multiple languages. Track translation status, download source files (ARB, XLIFF 1.2, XLIFF 2.0), and upload translated content. Filter by status, asset, and creation dates.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4
- **UI Components:** shadcn/ui (Radix UI + Tailwind CSS)
- **Icons:** Lucide React
- **Utilities:** class-variance-authority, clsx, tailwind-merge

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Knak Enterprise account with API access
- Knak API token (generated from the [Knak Enterprise UI](https://enterprise.knak.io/account/api-access))

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd Knak-API-Demo
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

1. **API Authentication:**
   - When you first open the application, you'll see an API token input in the sidebar
   - Enter your Knak API token (you can generate one from [Knak's API Access page](https://enterprise.knak.io/account/api-access))
   - Click "Save" to configure authentication

2. **Explore Sections:**
   - Use the sidebar navigation to explore different API endpoint groups
   - Each section provides interactive buttons to fetch data from the Knak API
   - View responses in real-time with formatted cards and tables

## API Authentication

The Knak API supports two authentication methods:

### 1. API Key (Recommended for Development)
Generate a non-expiring token through the Enterprise UI via the [API Access menu](https://enterprise.knak.io/account/api-access). This application uses this method.

### 2. OAuth2 Authorization Code Grant Flow (Recommended for Production)
For production applications, use the OAuth2 flow. Manage OAuth2 applications at [Knak's OAuth Applications page](https://enterprise.knak.io/account/oauth-applications).

## Project Structure

```
├── app/
│   ├── assets/                    # Assets management page
│   ├── users/                     # User management page
│   ├── themes/                    # Themes browser page
│   ├── brands/                    # Brands page
│   ├── asset-folders/             # Asset folders page
│   ├── asset-custom-fieldsets/    # Custom fieldsets page
│   ├── available-platforms/       # Available platforms page
│   ├── merge-tags/                # Merge tags management page
│   ├── sync-statuses/             # Sync statuses page
│   ├── translation-requests/      # Translation requests page
│   ├── layout.tsx                 # Root layout with sidebar
│   ├── page.tsx                   # Dashboard/home page
│   └── globals.css                # Global styles with Tailwind directives
├── components/
│   ├── ui/                        # shadcn/ui components (Card, Button, Badge, Input, Accordion, etc.)
│   ├── api-test-get.tsx           # Reusable GET/DELETE endpoint test UI
│   ├── api-test-mutation.tsx      # Reusable POST/PATCH endpoint test UI
│   ├── api-token-input.tsx        # API token configuration
│   └── sidebar-nav.tsx            # Navigation component
├── lib/
│   ├── api-client.ts              # Knak API client with all endpoint methods
│   ├── types.ts                   # TypeScript type definitions
│   └── utils.ts                   # Utility functions (cn helper)
├── components.json                # shadcn/ui configuration
├── tailwind.config.ts             # Tailwind CSS configuration
└── openapi.yml                    # Knak API specification
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints Demonstrated

### Assets Management
- List all assets (emails and landing pages) with pagination
- Create new assets with theme and brand association
- Get detailed asset information
- Update asset custom fields
- Manage project management integrations (GET/PATCH/DELETE)
- Filter by parent asset

### User Management
- List all users with pagination
- Get specific user details
- Delete users from organization
- Filter users by email
- Sort by created_at or updated_at

### Themes
- Browse available themes with pagination
- Get detailed theme information
- Filter by name, tags, and published status
- Sort themes by various fields

### Brands
- List all brands with pagination
- Sort brands by various fields

### Asset Folders
- Create new folders and campaigns
- List folders with pagination
- Update folder properties (name, parent)
- Delete folders
- Filter by brand_id and parent_folder_id
- Navigate hierarchical folder structures

### Asset Custom Fieldsets
- List all custom fieldsets
- Get custom fields within a specific fieldset
- View field configurations and metadata schemas

### Available Platforms
- List all integrated marketing automation platforms
- View platform details and capabilities

### Merge Tags
- Create new merge tags
- List merge tags with pagination
- Get specific merge tag details
- Update merge tag properties
- Delete merge tags
- Filter by name and platform_id
- Full CRUD operations for dynamic content personalization

### Sync Statuses
- Get synchronization status by ID
- Update sync status (map_id, map_url, error_message, status)
- Track integration progress and results

### Translation Requests
- List translation requests with advanced filtering
- Get specific translation request details
- Update translation request status
- Download source files in multiple formats (ARB, XLIFF 1.2, XLIFF 2.0)
- Upload completed translation files
- Filter by status, asset_id, created_at_before, created_at_after
- Sort by various fields

## API Features

### Pagination
All list endpoints support pagination with `page` and `per_page` query parameters:
- Default page size: 10 items
- Maximum page size: 100 items

### Filtering
Many endpoints support filtering using `filter[field_name]` query parameters with exact or partial matching.

### Sorting
Sort results using the `sort` parameter with values like `created_at` or `updated_at`.

## Error Handling

The application handles common API errors:
- **400** - Bad Request
- **401** - Unauthenticated (check your API token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found

## Use Cases

This prototype demonstrates several real-world use cases:

1. **Campaign Management:** Browse and create email/landing page assets for marketing campaigns with theme and brand association
2. **Team Administration:** View and manage users within your organization with filtering and sorting capabilities
3. **Brand Consistency:** Browse themes to maintain consistent branding across all marketing materials
4. **Content Organization:** Create hierarchical folder structures to organize assets by brand, campaign, or project
5. **Custom Metadata:** Define and manage custom field schemas for assets to track additional metadata
6. **Platform Integration:** View available marketing automation platforms and manage merge tags for dynamic content
7. **Sync Monitoring:** Track synchronization statuses for platform integrations and update sync results
8. **Localization:** Request translations, download source files in multiple formats, and upload completed translations
9. **Project Management Integration:** Link assets to external project management systems for workflow coordination
10. **Dynamic Content:** Create and manage merge tags for personalization across different platforms

## Resources

- [Knak API Documentation](https://enterprise.knak.io/docs/api)
- [Knak Help Center](https://help.knak.io)
- [API Access (Generate Token)](https://enterprise.knak.io/account/api-access)
- [OAuth Applications](https://enterprise.knak.io/account/oauth-applications)
- [Webhooks Setup](https://enterprise.knak.io/account/webhooks)

## Development Notes

### API Client
The `lib/api-client.ts` file provides a typed API client with methods for all demonstrated endpoints. The client automatically includes the Bearer token in all requests and handles:
- Query parameter construction
- Request/response formatting
- Error handling with detailed messages
- File uploads (FormData) and downloads (Blob)

### Type Safety
All API responses are typed using TypeScript interfaces defined in `lib/types.ts`, ensuring type safety throughout the application.

### UI/UX Features

#### Accordion-Based Interface
Each API endpoint page uses shadcn/ui Accordion components to display multiple endpoints in a collapsible, vertical layout. This pattern:
- Scales well for pages with many endpoints (up to 7 endpoints per page)
- Allows users to focus on one endpoint at a time
- Provides better mobile responsiveness than horizontal tabs
- Maintains clean visual hierarchy

#### Color-Coded HTTP Method Badges
HTTP method badges use a consistent color coding system implemented through CVA (class-variance-authority) variants:
- **GET** - Green (`bg-green-500`)
- **POST** - Blue (`bg-blue-500`)
- **PATCH** - Orange (`bg-orange-500`)
- **DELETE** - Red (`bg-red-500`)

This visual system helps users quickly identify endpoint types and actions at a glance.

#### Reusable Test UI Components
- **ApiTestGet** (`components/api-test-get.tsx`) - For GET and DELETE endpoints
- **ApiTestMutation** (`components/api-test-mutation.tsx`) - For POST and PATCH endpoints

These components provide:
- Consistent interface across all pages
- Parameter input fields with validation
- JSON body editors for mutations
- Response display with performance metrics
- Error handling with detailed messages

### UI Components
The application uses [shadcn/ui](https://ui.shadcn.com/) components, built on top of Radix UI primitives and styled with Tailwind CSS. This provides:
- Accessible components following WAI-ARIA standards
- Fully customizable with Tailwind CSS
- Consistent design language throughout the application
- High-quality animations and interactions

**Components used:**
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Button (with multiple variants: default, outline, ghost, destructive)
- Badge (with custom HTTP method variants: get, post, patch, delete)
- Input (for API token entry and parameter inputs)
- Alert, AlertDescription (for error messages)
- Skeleton (for loading states)
- Accordion, AccordionItem, AccordionTrigger, AccordionContent
- Separator (for visual division)

## Future Enhancements

Potential features to add:
- **Asset Content Preview:** Visual preview of email and landing page HTML
- **User Creation and Editing:** Full CRUD operations for user management
- **Real-time Webhook Events:** Display and monitor webhook events as they occur
- **Advanced Search:** Global search across all resources with fuzzy matching
- **Bulk Operations:** Multi-select and batch actions for assets, folders, and merge tags
- **Export Functionality:** Export data to CSV, JSON, or Excel formats
- **Dark Mode Support:** Theme toggle for light/dark color schemes
- **Asset Analytics:** View usage statistics and performance metrics for assets
- **Collaboration Features:** Comments, approvals, and workflow management
- **Template Library:** Browse and clone pre-built email/landing page templates
- **API Response Caching:** Cache frequently accessed resources for better performance
- **Keyboard Shortcuts:** Power-user keyboard navigation and actions

## License

ISC

## Support

For API-related questions, contact [support@knak.com](mailto:support@knak.com) or visit the [Knak Help Center](https://help.knak.io).
