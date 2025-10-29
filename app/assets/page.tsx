'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Asset } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ApiTestGet } from '@/components/api-test-get';
import { ApiTestMutation } from '@/components/api-test-mutation';
import { FileText, Mail, Globe, Search, Plus, Loader2, AlertCircle } from 'lucide-react';

export default function AssetsPage() {
  // Test UI state
  const [listPage, setListPage] = useState(1);
  const [listPerPage, setListPerPage] = useState('10');
  const [filterParentAssetId, setFilterParentAssetId] = useState('');
  const [assetId, setAssetId] = useState('');
  const [contentAssetId, setContentAssetId] = useState('');
  const [contentPlatform, setContentPlatform] = useState('');
  const [customFieldsAssetId, setCustomFieldsAssetId] = useState('');
  const [updateCustomFieldsAssetId, setUpdateCustomFieldsAssetId] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets Manager</h1>
          <p className="mt-2 text-muted-foreground">
            Browse, create, and manage email and landing page assets
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
              <Badge className="font-mono text-xs http-method-get">
                GET /assets
              </Badge>
              <Badge className="font-mono text-xs http-method-post">
                POST /assets
              </Badge>
              <Badge className="font-mono text-xs http-method-get">
                GET /assets/:id
              </Badge>
              <Badge className="font-mono text-xs http-method-get">
                GET /assets/:id/content
              </Badge>
              <Badge className="font-mono text-xs http-method-get">
                GET /assets/:id/custom-fields
              </Badge>
              <Badge className="font-mono text-xs http-method-patch">
                PATCH /assets/:id/custom-fields
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Asset Types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Email Assets</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-green-600" />
              <span className="text-sm">Landing Page Assets</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Use Cases</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Browse all assets</li>
              <li>Create new campaigns</li>
              <li>View asset details & HTML</li>
              <li>Manage custom fields</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test API Endpoints</CardTitle>
          <CardDescription>
            Interactive testing for asset endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge className="font-mono text-xs http-method-post">POST</Badge>
                  <span>/assets</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestMutation
                  title="Create an Asset"
                  description="Create a new email or landing page asset"
                  endpoint="/assets"
                  method="POST"
                  defaultBody={{
                    name: 'My New Email',
                    type: 'email',
                    campaign_id: 'campaign_123',
                    theme_id: 'theme_456',
                    from_name: 'Sender Name',
                    from_email: 'email@knak.com',
                    reply_email: 'reply@knak.com',
                    subject: 'Email Subject Line',
                    preview_text: 'This is the preview text',
                    custom_fields: [
                      {
                        name: 'custom_field_key_1',
                        value: 'field value 1',
                      },
                    ],
                    tags: ['tag1', 'tag2'],
                  }}
                  onExecute={async (body) => {
                    return await apiClient.createAsset(body);
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge className="font-mono text-xs http-method-get">GET</Badge>
                  <span>/assets</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="List All Assets"
                  description="Retrieve a paginated list of all assets in your organization"
                  endpoint="GET /assets"
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
                      name: 'filter[parent_asset_id]',
                      label: 'Filter by Parent Asset ID (optional)',
                      placeholder: 'e.g., 609ca344d1b1b',
                      value: filterParentAssetId,
                      onChange: setFilterParentAssetId,
                    },
                  ]}
                  onExecute={async () => {
                    return await apiClient.getAssets({
                      page: listPage,
                      per_page: parseInt(listPerPage) || 10,
                      filter: filterParentAssetId ? { parent_asset_id: filterParentAssetId } : undefined,
                    });
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge className="font-mono text-xs http-method-get">GET</Badge>
                  <span>/assets/:id</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="Get Specific Asset"
                  description="Retrieve detailed information about a specific asset"
                  endpoint="GET /assets/{asset_id}"
                  parameters={[
                    {
                      name: 'asset_id',
                      label: 'Asset ID',
                      placeholder: 'e.g., 609d7ce223411',
                      value: assetId,
                      onChange: setAssetId,
                      required: true,
                    },
                  ]}
                  onExecute={async () => {
                    if (!assetId) throw new Error('Asset ID is required');
                    return await apiClient.getAsset(assetId);
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge className="font-mono text-xs http-method-get">GET</Badge>
                  <span>/assets/:id/content</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="Get Asset HTML Content"
                  description="Retrieve the HTML content of an asset, optionally formatted for a specific platform"
                  endpoint="GET /assets/{asset_id}/content"
                  parameters={[
                    {
                      name: 'asset_id',
                      label: 'Asset ID',
                      placeholder: 'e.g., 609d7ce223411',
                      value: contentAssetId,
                      onChange: setContentAssetId,
                      required: true,
                    },
                    {
                      name: 'platform',
                      label: 'Platform (optional)',
                      placeholder: 'e.g., marketo, eloqua, pardot',
                      value: contentPlatform,
                      onChange: setContentPlatform,
                    },
                  ]}
                  onExecute={async () => {
                    if (!contentAssetId) throw new Error('Asset ID is required');
                    return await apiClient.getAssetContent(
                      contentAssetId,
                      contentPlatform || undefined
                    );
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge className="font-mono text-xs http-method-get">GET</Badge>
                  <span>/assets/:id/custom-fields</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="Get Asset Custom Fields"
                  description="Retrieve custom field values defined on an asset"
                  endpoint="GET /assets/{asset_id}/custom-fields"
                  parameters={[
                    {
                      name: 'asset_id',
                      label: 'Asset ID',
                      placeholder: 'e.g., 609d7ce223411',
                      value: customFieldsAssetId,
                      onChange: setCustomFieldsAssetId,
                      required: true,
                    },
                  ]}
                  onExecute={async () => {
                    if (!customFieldsAssetId) throw new Error('Asset ID is required');
                    return await apiClient.getAssetCustomFields(customFieldsAssetId);
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge className="font-mono text-xs http-method-patch">PATCH</Badge>
                  <span>/assets/:id/custom-fields</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestMutation
                  title="Update Asset Custom Fields"
                  description="Update custom field values on an asset"
                  endpoint="/assets/{asset_id}/custom-fields"
                  method="PATCH"
                  defaultBody={{
                    asset_custom_fields: [
                      {
                        key: 'custom_field_key_1',
                        value: 'field value 1',
                      },
                    ],
                  }}
                  onExecute={async (body) => {
                    if (!updateCustomFieldsAssetId) throw new Error('Asset ID is required');
                    return await apiClient.updateAssetCustomFields(
                      updateCustomFieldsAssetId,
                      body.asset_custom_fields || []
                    );
                  }}
                />
                <div className="mt-4">
                  <label className="text-xs text-muted-foreground">Asset ID</label>
                  <input
                    type="text"
                    value={updateCustomFieldsAssetId}
                    onChange={(e) => setUpdateCustomFieldsAssetId(e.target.value)}
                    placeholder="e.g., 609d7ce223411"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}
