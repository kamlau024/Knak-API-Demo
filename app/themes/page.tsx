'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Theme } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Search, Loader2, Mail, Globe } from 'lucide-react';

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchThemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getThemes({ page, per_page: 12 });
      setThemes(response.data);
      setTotalPages(response.meta.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch themes');
    } finally {
      setLoading(false);
    }
  };

  const getThemeIcon = (type: string) => {
    return type === 'email' ? Mail : Globe;
  };

  const getThemeTypeColor = (type: string) => {
    return type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theme Browser</h1>
          <p className="mt-2 text-muted-foreground">
            Browse available themes for creating branded emails and landing pages
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Available Endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="outline" className="font-mono text-xs">
              GET /themes
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              GET /themes/:id
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Theme Types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Email Themes</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-600" />
              <span className="text-sm">Landing Page Themes</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Use Cases</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Browse theme library</li>
              <li>Select theme for assets</li>
              <li>Maintain brand consistency</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Themes</CardTitle>
              <CardDescription>
                Browse all themes available in your Knak organization
              </CardDescription>
            </div>
            <Button onClick={fetchThemes} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Fetch Themes
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {!error && themes.length === 0 && !loading && (
            <div className="py-12 text-center">
              <Palette className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No themes loaded yet. Click "Fetch Themes" to browse available themes.
              </p>
            </div>
          )}

          {themes.length > 0 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {themes.map((theme) => {
                  const Icon = getThemeIcon(theme.type);
                  return (
                    <Card key={theme.id} className="overflow-hidden transition-shadow hover:shadow-md">
                      {theme.thumbnail_url && (
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          <img
                            src={theme.thumbnail_url}
                            alt={theme.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      {!theme.thumbnail_url && (
                        <div className="aspect-video w-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <Palette className="h-12 w-12 text-purple-400" />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <CardTitle className="text-base">{theme.name}</CardTitle>
                          </div>
                          <Badge className={`${getThemeTypeColor(theme.type)} border-0`}>
                            {theme.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div>ID: {theme.id}</div>
                          <div>Created: {new Date(theme.created_at).toLocaleDateString()}</div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1 || loading}
                    onClick={() => {
                      setPage(page - 1);
                      fetchThemes();
                    }}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages || loading}
                    onClick={() => {
                      setPage(page + 1);
                      fetchThemes();
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Using Themes</CardTitle>
          <CardDescription>How themes work in Knak</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Themes are template designs that ensure consistent branding across your
            marketing assets. When creating a new asset, you can specify a theme_id to
            use that theme's design elements.
          </p>
          <div className="rounded-md bg-muted p-4">
            <p className="mb-2 text-sm font-medium">Example: Creating asset with theme</p>
            <pre className="overflow-x-auto text-xs">
              {JSON.stringify(
                {
                  name: 'Q4 Newsletter',
                  type: 'email',
                  campaign_id: 'campaign_123',
                  theme_id: 'theme_456',
                },
                null,
                2
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
