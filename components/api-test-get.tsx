'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Loader2, Play, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface ApiTestGetProps {
  title: string;
  description: string;
  endpoint: string;
  onExecute: () => Promise<any>;
  parameters?: Array<{
    name: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
  }>;
}

export function ApiTestGet({ title, description, endpoint, onExecute, parameters }: ApiTestGetProps) {
  const [loading, setLoading] = useState(false);
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
      const result = await onExecute();
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
            {endpoint}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {parameters && parameters.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Parameters</h4>
            {parameters.map((param) => (
              <div key={param.name} className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  {param.label} {param.required && <span className="text-destructive">*</span>}
                </label>
                <Input
                  value={param.value}
                  onChange={(e) => param.onChange(e.target.value)}
                  placeholder={param.placeholder}
                  className="font-mono text-xs"
                />
              </div>
            ))}
          </div>
        )}

        <Button onClick={handleExecute} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
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
