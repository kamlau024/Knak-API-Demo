'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Brand, AssetFolder } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderTree, Search, Loader2, Folder, Tag } from 'lucide-react';

export default function OrganizationPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [folders, setFolders] = useState<AssetFolder[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [folderError, setFolderError] = useState<string | null>(null);

  const fetchBrands = async () => {
    setLoadingBrands(true);
    setBrandError(null);
    try {
      const response = await apiClient.getBrands({ per_page: 20 });
      setBrands(response.data);
    } catch (err) {
      setBrandError(err instanceof Error ? err.message : 'Failed to fetch brands');
    } finally {
      setLoadingBrands(false);
    }
  };

  const fetchFolders = async () => {
    setLoadingFolders(true);
    setFolderError(null);
    try {
      const response = await apiClient.getAssetFolders({ per_page: 50 });
      setFolders(response.data);
    } catch (err) {
      setFolderError(err instanceof Error ? err.message : 'Failed to fetch folders');
    } finally {
      setLoadingFolders(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization</h1>
          <p className="mt-2 text-muted-foreground">
            Browse brands and folder structures for organizing your assets
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
              GET /brands
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              GET /asset-folders
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              GET /asset-folders/:id
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Organization Structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Brands</span>
            </div>
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Asset Folders</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Use Cases</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Browse brands</li>
              <li>Navigate folder structure</li>
              <li>Organize assets</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Brands</CardTitle>
              <CardDescription>
                High-level containers for organizing assets by brand
              </CardDescription>
            </div>
            <Button onClick={fetchBrands} disabled={loadingBrands}>
              {loadingBrands ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Fetch Brands
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {brandError && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {brandError}
            </div>
          )}

          {!brandError && brands.length === 0 && !loadingBrands && (
            <div className="py-12 text-center">
              <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No brands loaded. Click "Fetch Brands" to view your brands.
              </p>
            </div>
          )}

          {brands.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {brands.map((brand) => (
                <Card key={brand.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-purple-600" />
                      <CardTitle className="text-lg">{brand.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ID:</span>
                        <span className="font-mono text-xs">{brand.id}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(brand.created_at).toLocaleDateString()}
                      </div>
                      {brand.updated_at !== brand.created_at && (
                        <div className="text-xs text-muted-foreground">
                          Updated: {new Date(brand.updated_at).toLocaleDateString()}
                        </div>
                      )}
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
              <CardTitle>Asset Folders</CardTitle>
              <CardDescription>
                Hierarchical folder structure for organizing assets
              </CardDescription>
            </div>
            <Button onClick={fetchFolders} disabled={loadingFolders}>
              {loadingFolders ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Fetch Folders
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {folderError && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {folderError}
            </div>
          )}

          {!folderError && folders.length === 0 && !loadingFolders && (
            <div className="py-12 text-center">
              <FolderTree className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No folders loaded. Click "Fetch Folders" to view your folder structure.
              </p>
            </div>
          )}

          {folders.length > 0 && (
            <div className="space-y-3">
              {folders.map((folder) => (
                <Card key={folder.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Folder className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-semibold">{folder.name}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span>ID: {folder.id}</span>
                          {folder.parent_folder_id && (
                            <Badge variant="outline" className="text-xs">
                              Parent: {folder.parent_folder_id}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>Brand: {folder.brand_id}</div>
                      <div>Created: {new Date(folder.created_at).toLocaleDateString()}</div>
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
          <CardTitle>About Organization</CardTitle>
          <CardDescription>How brands and folders structure your assets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium">Brands</h4>
            <p className="text-sm text-muted-foreground">
              Brands serve as high-level containers for organizing your marketing assets.
              Each brand can contain multiple assets and folders, allowing you to
              separate content for different product lines, divisions, or clients.
            </p>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium">Asset Folders</h4>
            <p className="text-sm text-muted-foreground">
              Asset Folders provide a hierarchical structure within brands. Folders can
              have parent folders, enabling you to create nested organizational
              structures. This makes it easy to categorize assets by campaign, quarter,
              region, or any other criteria that suits your workflow.
            </p>
          </div>
          <div className="rounded-md bg-muted p-4">
            <p className="mb-2 text-sm font-medium">Example: Creating asset in folder</p>
            <pre className="overflow-x-auto text-xs">
              {JSON.stringify(
                {
                  name: 'Q4 Campaign Email',
                  type: 'email',
                  campaign_id: 'campaign_123',
                  brand_id: 'brand_456',
                  folder_id: 'folder_789',
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
