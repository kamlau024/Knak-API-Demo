'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { TranslationRequest } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ApiTestGet } from '@/components/api-test-get';
import { ApiTestMutation } from '@/components/api-test-mutation';
import { Languages, Download, Upload, FileText } from 'lucide-react';

export default function TranslationRequestsPage() {
  // Test UI state
  const [listPage, setListPage] = useState(1);
  const [listPerPage, setListPerPage] = useState('10');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAssetId, setFilterAssetId] = useState('');
  const [filterCreatedBefore, setFilterCreatedBefore] = useState('');
  const [filterCreatedAfter, setFilterCreatedAfter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [translationRequestId, setTranslationRequestId] = useState('');
  const [updateTranslationRequestId, setUpdateTranslationRequestId] = useState('');
  const [downloadSourceId, setDownloadSourceId] = useState('');
  const [downloadFormat, setDownloadFormat] = useState<'arb' | 'xliff-1.2' | 'xliff-2.0'>('xliff-2.0');
  const [uploadTranslationId, setUploadTranslationId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<string>('');
  const [downloadResult, setDownloadResult] = useState<string>('');

  const handleDownloadSource = async () => {
    if (!downloadSourceId) {
      setDownloadResult('Translation Request ID is required');
      return;
    }

    try {
      const blob = await apiClient.downloadTranslationSource(downloadSourceId, downloadFormat);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translation-source-${downloadSourceId}.${downloadFormat === 'arb' ? 'arb' : 'xliff'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setDownloadResult('File downloaded successfully');
    } catch (error) {
      setDownloadResult(`Error: ${error instanceof Error ? error.message : 'Download failed'}`);
    }
  };

  const handleUploadTranslation = async () => {
    if (!uploadTranslationId) {
      setUploadResult('Translation Request ID is required');
      return;
    }
    if (!uploadFile) {
      setUploadResult('Please select a file to upload');
      return;
    }

    try {
      const result = await apiClient.uploadTranslation(uploadTranslationId, uploadFile);
      setUploadResult(`Success: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      setUploadResult(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Translation Requests</h1>
          <p className="mt-2 text-muted-foreground">
            Manage translation requests for multi-language content
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
              <Badge variant="get" className="font-mono text-xs">
                GET /translation-requests
              </Badge>
              <Badge variant="get" className="font-mono text-xs">
                GET /translation-requests/:id
              </Badge>
              <Badge variant="patch" className="font-mono text-xs">
                PATCH /translation-requests/:id
              </Badge>
              <Badge variant="get" className="font-mono text-xs">
                GET /translation-requests/:id/download-source
              </Badge>
              <Badge variant="post" className="font-mono text-xs">
                POST /translation-requests/:id/upload-translation
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Translation Features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              <span className="text-sm">Multi-format Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-rose-600" />
              <span className="text-sm">Multiple Languages</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Use Cases</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>Manage translations</li>
              <li>Download source files</li>
              <li>Upload translated content</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Translation Requests API Endpoints</CardTitle>
          <CardDescription>
            Interactive testing for translation request endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="get" className="font-mono">GET</Badge>
                  <span>/translation-requests</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="List Translation Requests"
                  description="Retrieve a paginated list of all translation requests"
                  endpoint="GET /translation-requests"
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
                      name: 'filter[status]',
                      label: 'Filter by Status (optional)',
                      placeholder: 'e.g., requested',
                      value: filterStatus,
                      onChange: setFilterStatus,
                    },
                    {
                      name: 'filter[asset_id]',
                      label: 'Filter by Asset ID (optional)',
                      placeholder: 'e.g., 609ca344d1b1b',
                      value: filterAssetId,
                      onChange: setFilterAssetId,
                    },
                    {
                      name: 'filter[created_at_before]',
                      label: 'Created Before (optional)',
                      placeholder: 'e.g., 2023-04-01T00:00:00Z',
                      value: filterCreatedBefore,
                      onChange: setFilterCreatedBefore,
                    },
                    {
                      name: 'filter[created_at_after]',
                      label: 'Created After (optional)',
                      placeholder: 'e.g., 2023-04-03T00:00:00Z',
                      value: filterCreatedAfter,
                      onChange: setFilterCreatedAfter,
                    },
                    {
                      name: 'sort',
                      label: 'Sort By (optional)',
                      placeholder: 'e.g., created_at, -created_at',
                      value: sortBy,
                      onChange: setSortBy,
                    },
                  ]}
                  onExecute={async () => {
                    const filters: any = {};
                    if (filterStatus) filters.status = filterStatus;
                    if (filterAssetId) filters.asset_id = filterAssetId;
                    if (filterCreatedBefore) filters.created_at_before = filterCreatedBefore;
                    if (filterCreatedAfter) filters.created_at_after = filterCreatedAfter;

                    return await apiClient.getTranslationRequests({
                      page: listPage,
                      per_page: parseInt(listPerPage) || 10,
                      ...(Object.keys(filters).length > 0 && { filter: filters }),
                      ...(sortBy && { sort: sortBy }),
                    });
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="get" className="font-mono">GET</Badge>
                  <span>/translation-requests/:id</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="Get Translation Request"
                  description="Retrieve a specific translation request by ID"
                  endpoint="GET /translation-requests/{id}"
                  parameters={[
                    {
                      name: 'id',
                      label: 'Translation Request ID',
                      placeholder: 'e.g., 609d7ce223411',
                      value: translationRequestId,
                      onChange: setTranslationRequestId,
                      required: true,
                    },
                  ]}
                  onExecute={async () => {
                    if (!translationRequestId) throw new Error('Translation Request ID is required');
                    return await apiClient.getTranslationRequest(translationRequestId);
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="patch" className="font-mono">PATCH</Badge>
                  <span>/translation-requests/:id</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestMutation
                  title="Update Translation Request Status"
                  description="Update the status of a translation request"
                  endpoint="/translation-requests/{id}"
                  method="PATCH"
                  defaultBody={{
                    status: 'processing',
                  }}
                  onExecute={async (body) => {
                    if (!updateTranslationRequestId) throw new Error('Translation Request ID is required');
                    return await apiClient.updateTranslationRequest(updateTranslationRequestId, body);
                  }}
                />
                <div className="mt-4">
                  <label className="text-xs text-muted-foreground">Translation Request ID</label>
                  <input
                    type="text"
                    value={updateTranslationRequestId}
                    onChange={(e) => setUpdateTranslationRequestId(e.target.value)}
                    placeholder="e.g., 609d7ce223411"
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="get" className="font-mono">GET</Badge>
                  <span>/translation-requests/:id/download-source</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold">Download Source File</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Download the source file for a translation request in the specified format
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Translation Request ID *</label>
                      <input
                        type="text"
                        value={downloadSourceId}
                        onChange={(e) => setDownloadSourceId(e.target.value)}
                        placeholder="e.g., 609d7ce223411"
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground">Format</label>
                      <select
                        value={downloadFormat}
                        onChange={(e) => setDownloadFormat(e.target.value as any)}
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="arb">arb</option>
                        <option value="xliff-1.2">xliff-1.2</option>
                        <option value="xliff-2.0">xliff-2.0</option>
                      </select>
                    </div>

                    <Button onClick={handleDownloadSource} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Source File
                    </Button>

                    {downloadResult && (
                      <div className="rounded-md bg-muted p-3 text-xs">
                        {downloadResult}
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="post" className="font-mono">POST</Badge>
                  <span>/translation-requests/:id/upload-translation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold">Upload Translated File</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload a completed translation file. The file will be validated and applied asynchronously.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Translation Request ID *</label>
                      <input
                        type="text"
                        value={uploadTranslationId}
                        onChange={(e) => setUploadTranslationId(e.target.value)}
                        placeholder="e.g., 609d7ce223411"
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground">Translation File *</label>
                      <input
                        type="file"
                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                        accept=".arb,.xliff,.xlf"
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:mr-4 file:rounded-sm file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-xs file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <Button onClick={handleUploadTranslation} className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Translation
                    </Button>

                    {uploadResult && (
                      <div className="rounded-md bg-muted p-3 text-xs whitespace-pre-wrap">
                        {uploadResult}
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
