import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Users,
  Palette,
  Sparkles,
  Folders,
  Settings,
  Boxes,
  Tag,
  RefreshCw,
  FileType,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'Assets Management',
    description: 'Create, view, and manage email and landing page assets',
    icon: FileText,
    href: '/assets',
    endpoints: ['GET /assets', 'POST /assets', 'GET /assets/{id}', 'PATCH /assets/{id}/custom-fields', 'GET/PATCH/DELETE project-management-link'],
    color: 'text-blue-600',
  },
  {
    title: 'User Management',
    description: 'View and manage users within your organization',
    icon: Users,
    href: '/users',
    endpoints: ['GET /users', 'GET /users/{id}', 'DELETE /users/{id}'],
    color: 'text-green-600',
  },
  {
    title: 'Themes',
    description: 'Browse available themes for creating branded assets',
    icon: Palette,
    href: '/themes',
    endpoints: ['GET /themes', 'GET /themes/{id}'],
    color: 'text-purple-600',
  },
  {
    title: 'Brands',
    description: 'Manage brand guidelines and settings',
    icon: Sparkles,
    href: '/brands',
    endpoints: ['GET /brands'],
    color: 'text-pink-600',
  },
  {
    title: 'Asset Folders',
    description: 'Organize assets with folders and hierarchies',
    icon: Folders,
    href: '/asset-folders',
    endpoints: ['POST /asset-folders', 'GET /asset-folders', 'PATCH /asset-folders/{id}', 'DELETE /asset-folders/{id}'],
    color: 'text-amber-600',
  },
  {
    title: 'Asset Custom Fieldsets',
    description: 'Manage custom field configurations for assets',
    icon: Settings,
    href: '/asset-custom-fieldsets',
    endpoints: ['GET /asset-custom-fieldsets', 'GET /asset-custom-fieldsets/{id}/asset-custom-fields'],
    color: 'text-slate-600',
  },
  {
    title: 'Available Platforms',
    description: 'View integration platforms for your organization',
    icon: Boxes,
    href: '/available-platforms',
    endpoints: ['GET /available-platforms'],
    color: 'text-cyan-600',
  },
  {
    title: 'Merge Tags',
    description: 'Manage dynamic content merge tags',
    icon: Tag,
    href: '/merge-tags',
    endpoints: ['POST /merge-tags', 'GET /merge-tags', 'GET /merge-tags/{id}', 'PATCH /merge-tags/{id}', 'DELETE /merge-tags/{id}'],
    color: 'text-emerald-600',
  },
  {
    title: 'Sync Statuses',
    description: 'Track synchronization statuses for integrations',
    icon: RefreshCw,
    href: '/sync-statuses',
    endpoints: ['GET /sync-statuses/{id}', 'PATCH /sync-statuses/{id}'],
    color: 'text-indigo-600',
  },
  {
    title: 'Translation Requests',
    description: 'Manage translation requests for multi-language content',
    icon: FileType,
    href: '/translation-requests',
    endpoints: ['GET /translation-requests', 'GET /translation-requests/{id}', 'PATCH /translation-requests/{id}', 'GET download-source', 'POST upload-translation'],
    color: 'text-rose-600',
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Knak API Explorer</h1>
        <p className="mt-2 text-muted-foreground">
          Explore the Knak Enterprise API capabilities. This prototype demonstrates
          different API endpoint groups and their use cases.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Knak</CardTitle>
          <CardDescription>
            Enterprise email and landing page creation platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Knak is a no-code email and landing page builder designed for enterprise
            marketing teams. It enables teams to create beautiful, on-brand campaigns
            without requiring coding skills.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">No-Code Builder</Badge>
            <Badge variant="secondary">Enterprise Ready</Badge>
            <Badge variant="secondary">Platform Integrations</Badge>
            <Badge variant="secondary">Brand Control</Badge>
            <Badge variant="secondary">AI-Powered</Badge>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-2xl font-bold">API Capabilities</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="mt-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Available Endpoints:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {feature.endpoints.map((endpoint) => (
                        <Badge
                          key={endpoint}
                          variant="outline"
                          className="font-mono text-xs"
                        >
                          {endpoint}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>How to use this API explorer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            <li>
              <strong>Configure Authentication:</strong> Enter your Knak API token in
              the sidebar. You can generate one from the{' '}
              <a
                href="https://enterprise.knak.io/account/api-access"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Knak Enterprise UI
              </a>
              .
            </li>
            <li>
              <strong>Explore Sections:</strong> Navigate through different sections
              using the sidebar menu to explore various API endpoint groups.
            </li>
            <li>
              <strong>Test API Calls:</strong> Each section provides interactive
              interfaces to test API endpoints with your data.
            </li>
            <li>
              <strong>View Results:</strong> API responses are displayed in real-time,
              showing the structure and data returned by each endpoint.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
