# Knak API Explorer

A prototype Next.js application for exploring and interacting with the Knak Enterprise API. This application demonstrates the various API endpoint groups and their use cases in an intuitive, interactive interface.

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

### 2. Assets Manager
**Endpoints:** `GET /assets`, `POST /assets`, `GET /assets/:id`

Browse, create, and manage email and landing page assets. View asset details including type, status, creator, and timestamps.

### 3. User Management
**Endpoints:** `GET /users`, `GET /users/:id`, `DELETE /users/:id`

View and manage users within your Knak organization. Filter users by email and sort by creation date.

### 4. Theme Browser
**Endpoints:** `GET /themes`, `GET /themes/:id`

Browse available themes for creating branded assets. Themes provide consistent design elements across your marketing materials.

### 5. Translation Management
**Endpoints:** `GET /translation-requests`, `POST /translation-requests`, `GET /translation-requests/:id/download-source`, `POST /translation-requests/:id/upload-translation`

Request and manage asset translations across multiple languages. Track translation status and download/upload translated content.

### 6. Platform Integrations
**Endpoints:** `GET /available-platforms`, `GET /merge-tags`, `GET /merge-tags/:id`

View integrated marketing automation platforms and their merge tags for dynamic content personalization.

### 7. Organization
**Endpoints:** `GET /brands`, `GET /asset-folders`, `GET /asset-folders/:id`

Browse brands and folder structures for organizing your assets hierarchically.

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
│   ├── assets/          # Assets management page
│   ├── integrations/    # Platform integrations page
│   ├── organization/    # Brands and folders page
│   ├── themes/          # Theme browser page
│   ├── translations/    # Translation management page
│   ├── users/           # User management page
│   ├── layout.tsx       # Root layout with sidebar
│   ├── page.tsx         # Dashboard/home page
│   └── globals.css      # Global styles with Tailwind directives
├── components/
│   ├── ui/              # shadcn/ui components (Card, Button, Badge, Input, Alert, etc.)
│   ├── api-token-input.tsx  # API token configuration
│   └── sidebar-nav.tsx      # Navigation component
├── lib/
│   ├── api-client.ts    # Knak API client
│   ├── types.ts         # TypeScript type definitions
│   └── utils.ts         # Utility functions (cn helper)
├── components.json      # shadcn/ui configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── openapi.yml          # Knak API specification
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints Demonstrated

### Users
- List all users with pagination
- Get specific user details
- Filter users by email
- Sort by created_at or updated_at

### Assets
- List all assets (emails and landing pages)
- Create new assets
- Get asset details
- Filter by parent asset

### Themes
- Browse available themes
- Get theme details
- Filter by type (email/landing)

### Brands
- List all brands
- View brand containers

### Asset Folders
- Browse folder structure
- View hierarchical organization

### Available Platforms
- List integrated platforms
- View platform details

### Merge Tags
- Browse merge tags for personalization
- View tag codes and platform associations

### Translation Requests
- List translation requests
- View translation status
- Create new translation requests

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

1. **Campaign Management:** Browse and create email/landing page assets for marketing campaigns
2. **Team Administration:** View and manage users with different roles
3. **Brand Consistency:** Use themes to maintain consistent branding
4. **Localization:** Request and manage translations for global campaigns
5. **Platform Integration:** View connected marketing automation platforms
6. **Content Organization:** Organize assets using brands and folders

## Resources

- [Knak API Documentation](https://enterprise.knak.io/docs/api)
- [Knak Help Center](https://help.knak.io)
- [API Access (Generate Token)](https://enterprise.knak.io/account/api-access)
- [OAuth Applications](https://enterprise.knak.io/account/oauth-applications)
- [Webhooks Setup](https://enterprise.knak.io/account/webhooks)

## Development Notes

### API Client
The `lib/api-client.ts` file provides a typed API client with methods for all demonstrated endpoints. The client automatically includes the Bearer token in all requests.

### Type Safety
All API responses are typed using TypeScript interfaces defined in `lib/types.ts`, ensuring type safety throughout the application.

### UI Components
The application uses [shadcn/ui](https://ui.shadcn.com/) components, built on top of Radix UI primitives and styled with Tailwind CSS. This provides:
- Accessible components following WAI-ARIA standards
- Fully customizable with Tailwind CSS
- Consistent design language throughout the application
- High-quality animations and interactions

**Components used:**
- Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Button (with multiple variants: default, outline, ghost, destructive)
- Badge (default, secondary, outline, destructive)
- Input (for API token entry)
- Alert, AlertDescription (for error messages)
- Skeleton (for loading states)
- Separator, Tabs (for layout and organization)

## Future Enhancements

Potential features to add:
- Asset creation form with full field support
- User creation and editing
- Real-time webhook event display
- Asset content preview
- Advanced filtering and search
- Export functionality
- Dark mode support

## License

ISC

## Support

For API-related questions, contact [support@knak.com](mailto:support@knak.com) or visit the [Knak Help Center](https://help.knak.io).
