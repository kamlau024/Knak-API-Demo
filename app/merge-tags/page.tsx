'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { MergeTag } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ApiTestGet } from '@/components/api-test-get';
import { ApiTestMutation } from '@/components/api-test-mutation';
import { Tag, Code, Database } from 'lucide-react';

export default function MergeTagsPage() {
  // Test UI state
  const [listPage, setListPage] = useState(1);
  const [listPerPage, setListPerPage] = useState('10');
  const [filterName, setFilterName] = useState('');
  const [filterPlatformId, setFilterPlatformId] = useState('');
  const [mergeTagId, setMergeTagId] = useState('');
  const [updateMergeTagId, setUpdateMergeTagId] = useState('');
  const [deleteMergeTagId, setDeleteMergeTagId] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Merge Tags</h1>
          <p className="mt-2 text-muted-foreground">
            Manage dynamic content merge tags for your marketing platforms
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
                POST /merge-tags
              </Badge>
              <Badge variant="get" className="font-mono">
                GET /merge-tags
              </Badge>
              <Badge variant="get" className="font-mono">
                GET /merge-tags/:id
              </Badge>
              <Badge variant="patch" className="font-mono">
                PATCH /merge-tags/:id
              </Badge>
              <Badge variant="delete" className="font-mono">
                DELETE /merge-tags/:id
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Merge Tag Features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-emerald-600" />
              <span className="text-sm">Dynamic Variables</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-sky-600" />
              <span className="text-sm">Platform Integration</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Use Cases</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Personalize email content</li>
              <li>Insert dynamic data</li>
              <li>Map platform variables</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Merge Tags API Endpoints</CardTitle>
          <CardDescription>
            Interactive testing for merge tag endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="post" className="font-mono">POST</Badge>
                  <span>/merge-tags</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestMutation
                  title="Create Merge Tag"
                  description="Create a new merge tag for a specific platform"
                  endpoint="/merge-tags"
                  method="POST"
                  defaultBody={{
                    name: 'Lead First Name',
                    platform_id: 'marketo',
                    merge_tag_value: '{{lead.firstName}}',
                    description: 'The first name of the lead in Marketo',
                    is_special_link: false,
                    velocity_script_token: '${lead.firstName}',
                  }}
                  onExecute={async (body) => {
                    return await apiClient.createMergeTag(body);
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="get" className="font-mono">GET</Badge>
                  <span>/merge-tags</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="List All Merge Tags"
                  description="Retrieve a paginated list of all merge tags for your company"
                  endpoint="GET /merge-tags"
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
                      name: 'filter[name]',
                      label: 'Filter by Name (optional)',
                      placeholder: 'e.g., City',
                      value: filterName,
                      onChange: setFilterName,
                    },
                    {
                      name: 'filter[platform_id]',
                      label: 'Filter by Platform ID (optional)',
                      placeholder: 'e.g., marketo',
                      value: filterPlatformId,
                      onChange: setFilterPlatformId,
                    },
                  ]}
                  onExecute={async () => {
                    const filters: any = {};
                    if (filterName) filters.name = filterName;
                    if (filterPlatformId) filters.platform_id = filterPlatformId;

                    return await apiClient.getMergeTags({
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
                  <Badge variant="get" className="font-mono">GET</Badge>
                  <span>/merge-tags/:id</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="Get Specific Merge Tag"
                  description="Retrieve a specific merge tag by its ID"
                  endpoint="GET /merge-tags/{merge_tag_id}"
                  parameters={[
                    {
                      name: 'merge_tag_id',
                      label: 'Merge Tag ID',
                      placeholder: 'e.g., 609d7ce223411',
                      value: mergeTagId,
                      onChange: setMergeTagId,
                      required: true,
                    },
                  ]}
                  onExecute={async () => {
                    if (!mergeTagId) throw new Error('Merge Tag ID is required');
                    return await apiClient.getMergeTag(mergeTagId);
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="patch" className="font-mono">PATCH</Badge>
                  <span>/merge-tags/:id</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestMutation
                  title="Update Merge Tag"
                  description="Update a specific merge tag. This endpoint allows partial updates."
                  endpoint="/merge-tags/{merge_tag_id}"
                  method="PATCH"
                  defaultBody={{
                    description: 'Updated description for the merge tag',
                    merge_tag_value: '{{lead.UpdatedField}}',
                    velocity_script_token: '${lead.UpdatedField}',
                    is_special_link: false,
                  }}
                  onExecute={async (body) => {
                    if (!updateMergeTagId) throw new Error('Merge Tag ID is required');
                    return await apiClient.updateMergeTag(updateMergeTagId, body);
                  }}
                />
                <div className="mt-4">
                  <label className="text-xs text-muted-foreground">Merge Tag ID</label>
                  <input
                    type="text"
                    value={updateMergeTagId}
                    onChange={(e) => setUpdateMergeTagId(e.target.value)}
                    placeholder="e.g., 609d7ce223411"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="delete" className="font-mono">DELETE</Badge>
                  <span>/merge-tags/:id</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="Delete Merge Tag"
                  description="Delete a merge tag by its ID"
                  endpoint="DELETE /merge-tags/{merge_tag_id}"
                  parameters={[
                    {
                      name: 'merge_tag_id',
                      label: 'Merge Tag ID',
                      placeholder: 'e.g., 609d7ce223411',
                      value: deleteMergeTagId,
                      onChange: setDeleteMergeTagId,
                      required: true,
                    },
                  ]}
                  onExecute={async () => {
                    if (!deleteMergeTagId) throw new Error('Merge Tag ID is required');
                    return await apiClient.deleteMergeTag(deleteMergeTagId);
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
