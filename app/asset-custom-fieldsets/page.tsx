'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { AssetCustomFieldset } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ApiTestGet } from '@/components/api-test-get';
import { Settings, Tag, List } from 'lucide-react';

export default function AssetCustomFieldsetsPage() {
  // Test UI state
  const [listPage, setListPage] = useState(1);
  const [listPerPage, setListPerPage] = useState('10');
  const [fieldsetId, setFieldsetId] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Custom Fieldsets</h1>
          <p className="mt-2 text-muted-foreground">
            Manage custom field configurations for your assets
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
              <Badge variant="get" className="font-mono">
                GET /asset-custom-fieldsets
              </Badge>
              <Badge variant="get" className="font-mono">
                GET /asset-custom-fieldsets/:id/asset-custom-fields
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Custom Field Features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-teal-600" />
              <span className="text-sm">Flexible Metadata</span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-600" />
              <span className="text-sm">Configurable Fields</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Use Cases</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Store custom metadata</li>
              <li>Extend asset properties</li>
              <li>Organize field collections</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Custom Fieldsets API Endpoints</CardTitle>
          <CardDescription>
            Interactive testing for asset custom fieldset endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="get" className="font-mono">GET</Badge>
                  <span>/asset-custom-fieldsets</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="List Asset Custom Fieldsets"
                  description="Retrieve a paginated list of all asset custom fieldsets in your organization"
                  endpoint="GET /asset-custom-fieldsets"
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
                  ]}
                  onExecute={async () => {
                    return await apiClient.getAssetCustomFieldsets({
                      page: listPage,
                      per_page: parseInt(listPerPage) || 10,
                    });
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="get" className="font-mono">GET</Badge>
                  <span>/asset-custom-fieldsets/:id/asset-custom-fields</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="List Asset Custom Fields in Fieldset"
                  description="Retrieve all asset custom fields within a specific asset custom fieldset"
                  endpoint="GET /asset-custom-fieldsets/{asset_custom_fieldset_id}/asset-custom-fields"
                  parameters={[
                    {
                      name: 'asset_custom_fieldset_id',
                      label: 'Asset Custom Fieldset ID',
                      placeholder: 'e.g., 64a4810d4d12b',
                      value: fieldsetId,
                      onChange: setFieldsetId,
                      required: true,
                    },
                  ]}
                  onExecute={async () => {
                    if (!fieldsetId) throw new Error('Asset Custom Fieldset ID is required');
                    return await apiClient.getAssetCustomFieldsInFieldset(fieldsetId);
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
