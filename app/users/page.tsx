'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users as UsersIcon, Search, Loader2, Mail, UserCircle, AlertCircle } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getUsers({ page, per_page: 10 });
      setUsers(response.data);
      setTotalPages(response.meta.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      builder: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800',
    };
    return colors[role.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage users within your Knak organization
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
              GET /users
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              GET /users/:id
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              DELETE /users/:id
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>User Roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge className="bg-red-100 text-red-800 border-0">Admin</Badge>
            <Badge className="bg-blue-100 text-blue-800 border-0">Builder</Badge>
            <Badge className="bg-gray-100 text-gray-800 border-0">Viewer</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Use Cases</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>View all users</li>
              <li>Filter by email</li>
              <li>Manage permissions</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users List</CardTitle>
              <CardDescription>
                Fetch and display all users in your Knak organization
              </CardDescription>
            </div>
            <Button onClick={fetchUsers} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Fetch Users
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!error && users.length === 0 && !loading && (
            <div className="py-12 text-center">
              <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No users loaded yet. Click "Fetch Users" to load your users.
              </p>
            </div>
          )}

          {users.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {users.map((user) => (
                  <Card key={user.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                          <UserCircle className="h-6 w-6 text-secondary-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge className={`${getRoleColor(user.role)} border-0`}>
                              {user.role}
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>ID: {user.id}</div>
                        <div>
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1 || loading}
                    onClick={() => {
                      setPage(page - 1);
                      fetchUsers();
                    }}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages || loading}
                    onClick={() => {
                      setPage(page + 1);
                      fetchUsers();
                    }}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Features</CardTitle>
          <CardDescription>Additional user management capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 text-sm font-medium">Filtering</h4>
            <p className="text-sm text-muted-foreground">
              You can filter users by email using the `filter[email]` query parameter
              with partial matching support.
            </p>
            <div className="mt-2 rounded-md bg-muted p-3">
              <code className="text-xs">
                GET /users?filter[email]=john@example.com
              </code>
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium">Sorting</h4>
            <p className="text-sm text-muted-foreground">
              Sort users by created_at or updated_at fields.
            </p>
            <div className="mt-2 rounded-md bg-muted p-3">
              <code className="text-xs">GET /users?sort=created_at</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
