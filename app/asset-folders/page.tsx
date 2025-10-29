'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { AssetFolder } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ApiTestGet } from '@/components/api-test-get';
import { ApiTestMutation } from '@/components/api-test-mutation';
import { FolderTree, Folder, FolderOpen } from 'lucide-react';

export default function AssetFoldersPage() {
  // Test UI state
  const [listPage, setListPage] = useState(1);
  const [listPerPage, setListPerPage] = useState('10');
  const [filterBrandId, setFilterBrandId] = useState('');
  const [filterParentFolderId, setFilterParentFolderId] = useState('');
  const [updateFolderId, setUpdateFolderId] = useState('');
  const [deleteFolderId, setDeleteFolderId] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Folders</h1>
          <p className="mt-2 text-muted-foreground">
            Organize and manage your assets with folders and hierarchies
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Available Endpoints</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="post" className="font-mono">
                POST /asset-folders
              </Badge>
              <Badge variant="get" className="font-mono">
                GET /asset-folders
              </Badge>
              <Badge variant="patch" className="font-mono">
                PATCH /asset-folders/:id
              </Badge>
              <Badge variant="delete" className="font-mono">
                DELETE /asset-folders/:id
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Folder Organization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-amber-600" />
              <span className="text-sm">Hierarchical Structure</span>
            </div>
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Brand-based Filtering</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Use Cases</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Organize assets by project</li>
              <li>Group by brand or campaign</li>
              <li>Create folder hierarchies</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Folders API Endpoints</CardTitle>
          <CardDescription>
            Interactive testing for asset folder endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="post" className="font-mono">POST</Badge>
                  <span>/asset-folders</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestMutation
                  title="Create Asset Folder"
                  description="Create a new asset folder or campaign"
                  endpoint="/asset-folders"
                  method="POST"
                  defaultBody={{
                    name: 'My New Folder',
                    type: 'folder',
                    parent_folder_id: '609d7ce223411',
                  }}
                  onExecute={async (body) => {
                    return await apiClient.createAssetFolder(body);
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="get" className="font-mono">GET</Badge>
                  <span>/asset-folders</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="List Asset Folders"
                  description="Retrieve a paginated list of all asset folders in your organization"
                  endpoint="GET /asset-folders"
                  parameters={[
                    {
                      name: 'page',
                      label: 'Page',
                      placeholder: 'e.g., 1',
                      value: listPage.toString(),
                      onChange: (value) => setListPage(parseInt(value) || 1),
                    },
                    {
                      name: 'per_page',
                      label: 'Per Page',
                      placeholder: 'e.g., 10',
                      value: listPerPage,
                      onChange: setListPerPage,
                    },
                    {
                      name: 'filter[brand_id]',
                      label: 'Filter by Brand ID (optional)',
                      placeholder: 'e.g., 609d7ce223411',
                      value: filterBrandId,
                      onChange: setFilterBrandId,
                    },
                    {
                      name: 'filter[parent_folder_id]',
                      label: 'Filter by Parent Folder ID (optional)',
                      placeholder: 'e.g., 609d7ce223411',
                      value: filterParentFolderId,
                      onChange: setFilterParentFolderId,
                    },
                  ]}
                  onExecute={async () => {
                    const filters: any = {};
                    if (filterBrandId) filters.brand_id = filterBrandId;
                    if (filterParentFolderId) filters.parent_folder_id = filterParentFolderId;

                    return await apiClient.getAssetFolders({
                      page: listPage,
                      per_page: parseInt(listPerPage) || 10,
                      ...(Object.keys(filters).length > 0 && { filter: filters }),
                    });
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="patch" className="font-mono">PATCH</Badge>
                  <span>/asset-folders/:id</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestMutation
                  title="Update Asset Folder"
                  description="Update an existing asset folder's name or parent"
                  endpoint="/asset-folders/{asset_folder_id}"
                  method="PATCH"
                  defaultBody={{
                    name: 'Updated Folder Name',
                    parent_folder_id: '609d7ce223411',
                  }}
                  onExecute={async (body) => {
                    if (!updateFolderId) throw new Error('Folder ID is required');
                    return await apiClient.updateAssetFolder(updateFolderId, body);
                  }}
                />
                <div className="mt-4">
                  <label className="text-xs text-muted-foreground">Folder ID</label>
                  <input
                    type="text"
                    value={updateFolderId}
                    onChange={(e) => setUpdateFolderId(e.target.value)}
                    placeholder="e.g., 609d7ce223411"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="delete" className="font-mono">DELETE</Badge>
                  <span>/asset-folders/:id</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="Delete Asset Folder"
                  description="Delete an asset folder and all its sub-content including folders, campaigns and assets"
                  endpoint="DELETE /asset-folders/{asset_folder_id}"
                  parameters={[
                    {
                      name: 'folder_id',
                      label: 'Folder ID',
                      placeholder: 'e.g., 609d7ce223411',
                      value: deleteFolderId,
                      onChange: setDeleteFolderId,
                      required: true,
                    },
                  ]}
                  onExecute={async () => {
                    if (!deleteFolderId) throw new Error('Folder ID is required');
                    return await apiClient.deleteAssetFolder(deleteFolderId);
                  }}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
