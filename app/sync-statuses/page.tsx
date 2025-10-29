'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { SyncStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ApiTestGet } from '@/components/api-test-get';
import { ApiTestMutation } from '@/components/api-test-mutation';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function SyncStatusesPage() {
  // Test UI state
  const [syncStatusId, setSyncStatusId] = useState('');
  const [updateSyncStatusId, setUpdateSyncStatusId] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sync Statuses</h1>
          <p className="mt-2 text-muted-foreground">
            Track and manage synchronization statuses for platform integrations
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
                GET /sync-statuses/:id
              </Badge>
              <Badge variant="patch" className="font-mono">
                PATCH /sync-statuses/:id
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sync Status Types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-600" />
              <span className="text-sm">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm">Error</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Use Cases</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Monitor sync progress</li>
              <li>Track integration status</li>
              <li>Update sync results</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sync Status API Endpoints</CardTitle>
          <CardDescription>
            Interactive testing for sync status endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="get" className="font-mono">GET</Badge>
                  <span>/sync-statuses/:id</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="Get Specific Sync Status"
                  description="Retrieve a specific sync status by its ID"
                  endpoint="GET /sync-statuses/{sync_status_id}"
                  parameters={[
                    {
                      name: 'sync_status_id',
                      label: 'Sync Status ID',
                      placeholder: 'e.g., 609d7ce223411',
                      value: syncStatusId,
                      onChange: setSyncStatusId,
                      required: true,
                    },
                  ]}
                  onExecute={async () => {
                    if (!syncStatusId) throw new Error('Sync Status ID is required');
                    return await apiClient.getSyncStatus(syncStatusId);
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="patch" className="font-mono">PATCH</Badge>
                  <span>/sync-statuses/:id</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestMutation
                  title="Update Sync Status"
                  description="Update a specific sync status with new information"
                  endpoint="/sync-statuses/{sync_status_id}"
                  method="PATCH"
                  defaultBody={{
                    map_id: '123456',
                    map_url: 'https://www.map.com/123456',
                    error_message: null,
                    status: 'complete',
                  }}
                  onExecute={async (body) => {
                    if (!updateSyncStatusId) throw new Error('Sync Status ID is required');
                    return await apiClient.updateSyncStatus(updateSyncStatusId, body);
                  }}
                />
                <div className="mt-4">
                  <label className="text-xs text-muted-foreground">Sync Status ID</label>
                  <input
                    type="text"
                    value={updateSyncStatusId}
                    onChange={(e) => setUpdateSyncStatusId(e.target.value)}
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
