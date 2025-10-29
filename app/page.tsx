import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Users,
  Palette,
  Languages,
  Plug,
  FolderTree,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'Assets Management',
    description: 'Create, view, and manage email and landing page assets',
    icon: FileText,
    href: '/assets',
    endpoints: ['GET /assets', 'POST /assets', 'GET /assets/{id}', 'GET /assets/{id}/content', 'GET /assets/{id}/custom-fields', 'PATCH /assets/{id}/custom-fields'],
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
    title: 'Theme Browser',
    description: 'Browse available themes for creating branded assets',
    icon: Palette,
    href: '/themes',
    endpoints: ['GET /themes', 'GET /themes/{id}'],
    color: 'text-purple-600',
  },
  {
    title: 'Translations',
    description: 'Request and manage asset translations across languages',
    icon: Languages,
    href: '/translations',
    endpoints: ['GET /translation-requests', 'POST /translation-requests'],
    color: 'text-orange-600',
  },
  {
    title: 'Platform Integrations',
    description: 'View available platforms and their merge tags',
    icon: Plug,
    href: '/integrations',
    endpoints: ['GET /available-platforms', 'GET /merge-tags'],
    color: 'text-pink-600',
  },
  {
    title: 'Organization',
    description: 'Browse brands and folder structures',
    icon: FolderTree,
    href: '/organization',
    endpoints: ['GET /brands', 'GET /asset-folders'],
    color: 'text-cyan-600',
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
