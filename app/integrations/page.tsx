'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { AvailablePlatform, MergeTag } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plug, Search, Loader2, Code2, Zap } from 'lucide-react';

export default function IntegrationsPage() {
  const [platforms, setPlatforms] = useState<AvailablePlatform[]>([]);
  const [mergeTags, setMergeTags] = useState<MergeTag[]>([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(false);
  const [loadingMergeTags, setLoadingMergeTags] = useState(false);
  const [platformError, setPlatformError] = useState<string | null>(null);
  const [mergeTagError, setMergeTagError] = useState<string | null>(null);

  const fetchPlatforms = async () => {
    setLoadingPlatforms(true);
    setPlatformError(null);
    try {
      const response = await apiClient.getAvailablePlatforms({ per_page: 20 });
      setPlatforms(response.data);
    } catch (err) {
      setPlatformError(err instanceof Error ? err.message : 'Failed to fetch platforms');
    } finally {
      setLoadingPlatforms(false);
    }
  };

  const fetchMergeTags = async () => {
    setLoadingMergeTags(true);
    setMergeTagError(null);
    try {
      const response = await apiClient.getMergeTags({ per_page: 50 });
      setMergeTags(response.data);
    } catch (err) {
      setMergeTagError(err instanceof Error ? err.message : 'Failed to fetch merge tags');
    } finally {
      setLoadingMergeTags(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Integrations</h1>
          <p className="mt-2 text-muted-foreground">
            View available marketing automation platforms and their merge tags
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
              GET /available-platforms
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              GET /merge-tags
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              GET /merge-tags/:id
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Supported Platforms</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="space-y-1 text-muted-foreground">
              <li>• Marketo</li>
              <li>• Eloqua</li>
              <li>• Pardot</li>
              <li>• Salesforce Marketing Cloud</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Use Cases</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>View integrations</li>
              <li>Browse merge tags</li>
              <li>Dynamic personalization</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Platforms</CardTitle>
              <CardDescription>
                Marketing automation platforms integrated with Knak
              </CardDescription>
            </div>
            <Button onClick={fetchPlatforms} disabled={loadingPlatforms}>
              {loadingPlatforms ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Fetch Platforms
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {platformError && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {platformError}
            </div>
          )}

          {!platformError && platforms.length === 0 && !loadingPlatforms && (
            <div className="py-12 text-center">
              <Plug className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No platforms loaded. Click "Fetch Platforms" to view integrations.
              </p>
            </div>
          )}

          {platforms.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {platforms.map((platform) => (
                <Card key={platform.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="secondary">{platform.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-mono text-xs">{platform.id}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Added: {new Date(platform.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Merge Tags</CardTitle>
              <CardDescription>
                Dynamic content tags for personalization
              </CardDescription>
            </div>
            <Button onClick={fetchMergeTags} disabled={loadingMergeTags}>
              {loadingMergeTags ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Fetch Merge Tags
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {mergeTagError && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {mergeTagError}
            </div>
          )}

          {!mergeTagError && mergeTags.length === 0 && !loadingMergeTags && (
            <div className="py-12 text-center">
              <Code2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No merge tags loaded. Click "Fetch Merge Tags" to view available tags.
              </p>
            </div>
          )}

          {mergeTags.length > 0 && (
            <div className="space-y-3">
              {mergeTags.map((tag) => (
                <Card key={tag.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Code2 className="h-4 w-4 text-purple-600" />
                      <div>
                        <div className="font-semibold">{tag.name}</div>
                        <code className="text-xs text-muted-foreground">{tag.code}</code>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {tag.platform_id}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Integrations</CardTitle>
          <CardDescription>How platform integrations work</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Knak integrates with major marketing automation platforms to enable seamless
            asset synchronization and dynamic content personalization. Available platforms
            are those with HTML downloads enabled or active integrations configured.
          </p>
          <div>
            <h4 className="mb-2 text-sm font-medium">Merge Tags</h4>
            <p className="text-sm text-muted-foreground">
              Merge tags are platform-specific tokens that enable dynamic content
              personalization. For example, you can use merge tags to insert a
              recipient's first name, company, or other personalized data into your
              emails and landing pages.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
