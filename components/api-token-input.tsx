'use client';

import { useState, useEffect } from 'react';
import { setApiToken, getApiToken } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key } from 'lucide-react';

export function ApiTokenInput() {
  const [token, setToken] = useState('');
  const [isSet, setIsSet] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const currentToken = getApiToken();
    if (currentToken) {
      setIsSet(true);
      setToken(currentToken);
    }
  }, []);

  const handleSaveToken = () => {
    if (token.trim()) {
      setApiToken(token.trim());
      setIsSet(true);
      setShowInput(false);
    }
  };

  if (isSet && !showInput) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
        <Key className="h-4 w-4 text-green-600" />
        <span className="text-sm text-muted-foreground">API token configured</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowInput(true)}
          className="ml-auto"
        >
          Change
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <Key className="h-4 w-4" />
        <h3 className="text-sm font-medium">API Authentication</h3>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Enter your Knak API token to access the API. You can generate one from the{' '}
        <a
          href="https://enterprise.knak.io/account/api-access"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Knak Enterprise UI
        </a>
        .
      </p>
      <div className="flex gap-2">
        <Input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter your API token"
          className="flex-1"
        />
        <Button onClick={handleSaveToken} size="sm">
          Save
        </Button>
      </div>
    </div>
  );
}
