'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface ApiTestMutationProps {
  title: string;
  description: string;
  endpoint: string;
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  onExecute: (body: any) => Promise<any>;
  defaultBody?: any;
}

export function ApiTestMutation({
  title,
  description,
  endpoint,
  method,
  onExecute,
  defaultBody = {},
}: ApiTestMutationProps) {
  const [loading, setLoading] = useState(false);
  const [requestBody, setRequestBody] = useState(JSON.stringify(defaultBody, null, 2));
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStatusCode(null);
    setResponseTime(null);

    const startTime = performance.now();

    try {
      const body = JSON.parse(requestBody);
      const result = await onExecute(body);
      const endTime = performance.now();

      setResponse(result);
      setStatusCode(200);
      setResponseTime(Math.round(endTime - startTime));
    } catch (err) {
      const endTime = performance.now();
      setError(err instanceof Error ? err.message : 'Request failed');
      setStatusCode(err instanceof Error && 'status' in err ? (err as any).status : 500);
      setResponseTime(Math.round(endTime - startTime));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            {method} {endpoint}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Request Body</h4>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="w-full resize-none rounded-md border bg-muted p-3 font-mono text-xs"
            rows={10}
            placeholder="Enter JSON request body..."
          />
        </div>

        <Button onClick={handleExecute} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Execute Request
            </>
          )}
        </Button>

        {(statusCode !== null || error) && (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              {statusCode !== null && (
                <div className="flex items-center gap-2">
                  {statusCode >= 200 && statusCode < 300 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  <span className="text-sm font-medium">Status:</span>
                  <Badge
                    variant={statusCode >= 200 && statusCode < 300 ? 'default' : 'destructive'}
                  >
                    {statusCode}
                  </Badge>
                </div>
              )}
              {responseTime !== null && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Time:</span>
                  <Badge variant="secondary">{responseTime}ms</Badge>
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {response && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Response</h4>
                <div className="rounded-md border bg-muted">
                  <textarea
                    readOnly
                    value={JSON.stringify(response, null, 2)}
                    className="w-full resize-none rounded-md bg-transparent p-3 font-mono text-xs"
                    rows={12}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
