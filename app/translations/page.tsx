'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { TranslationRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Languages, Search, Loader2, FileDown, FileUp } from 'lucide-react';

export default function TranslationsPage() {
  const [translations, setTranslations] = useState<TranslationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTranslations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getTranslationRequests({ page, per_page: 10 });
      setTranslations(response.data);
      setTotalPages(response.meta.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch translation requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Translation Management</h1>
          <p className="mt-2 text-muted-foreground">
            Request and manage asset translations across multiple languages
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
              GET /translation-requests
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              POST /translation-requests
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              GET /translation-requests/:id/download-source
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              POST /translation-requests/:id/upload-translation
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Translation Status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
            <Badge className="bg-blue-100 text-blue-800 border-0">In Progress</Badge>
            <Badge className="bg-green-100 text-green-800 border-0">Completed</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Use Cases</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Request translations</li>
              <li>Track translation status</li>
              <li>Download source content</li>
              <li>Upload translations</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Translation Requests</CardTitle>
              <CardDescription>
                View all translation requests for your assets
              </CardDescription>
            </div>
            <Button onClick={fetchTranslations} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Fetch Requests
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

          {!error && translations.length === 0 && !loading && (
            <div className="py-12 text-center">
              <Languages className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No translation requests loaded. Click "Fetch Requests" to view requests.
              </p>
            </div>
          )}

          {translations.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {translations.map((translation) => (
                  <Card key={translation.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Languages className="h-5 w-5" />
                            <span className="font-semibold">
                              {translation.source_language} → {translation.target_language}
                            </span>
                            <Badge className={`${getStatusColor(translation.status)} border-0`}>
                              {translation.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div>Asset ID: {translation.asset_id}</div>
                            <div>Request ID: {translation.id}</div>
                            <div>
                              Created: {new Date(translation.created_at).toLocaleDateString()}
                            </div>
                            {translation.updated_at !== translation.created_at && (
                              <div>
                                Updated: {new Date(translation.updated_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" disabled>
                            <FileDown className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" disabled>
                            <FileUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1 || loading}
                    onClick={() => {
                      setPage(page - 1);
                      fetchTranslations();
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
                      fetchTranslations();
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
          <CardTitle>Translation Workflow</CardTitle>
          <CardDescription>How to request and manage translations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium">1. Create Translation Request</h4>
            <p className="mb-2 text-sm text-muted-foreground">
              Submit a POST request to create a new translation request for an asset.
            </p>
            <div className="rounded-md bg-muted p-3">
              <pre className="overflow-x-auto text-xs">
                {JSON.stringify(
                  {
                    asset_id: 'asset_123',
                    source_language: 'en',
                    target_language: 'fr',
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium">2. Download Source Content</h4>
            <p className="text-sm text-muted-foreground">
              Use GET /translation-requests/:id/download-source to download the source
              content for translation.
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium">3. Upload Translation</h4>
            <p className="text-sm text-muted-foreground">
              Use POST /translation-requests/:id/upload-translation to submit the
              translated content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
