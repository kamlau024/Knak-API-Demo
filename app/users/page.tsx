'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ApiTestGet } from '@/components/api-test-get';
import { Users as UsersIcon, Mail, UserCircle } from 'lucide-react';

export default function UsersPage() {
  // Test UI state
  const [listPage, setListPage] = useState(1);
  const [listPerPage, setListPerPage] = useState('10');
  const [filterEmail, setFilterEmail] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [userId, setUserId] = useState('');
  const [deleteUserId, setDeleteUserId] = useState('');
  const [reassignTo, setReassignTo] = useState('');

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
            <div className="flex flex-wrap gap-2">
              <Badge variant="get" className="font-mono">
                GET /users
              </Badge>
              <Badge variant="get" className="font-mono">
                GET /users/:id
              </Badge>
              <Badge variant="delete" className="font-mono">
                DELETE /users/:id
              </Badge>
            </div>
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
          <CardTitle>Users API Endpoints</CardTitle>
          <CardDescription>
            Interactive testing for user endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="get" className="font-mono">GET</Badge>
                  <span>/users</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="List All Users"
                  description="Retrieve a paginated list of all users in your organization"
                  endpoint="GET /users"
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
                      name: 'filter[email]',
                      label: 'Filter by Email (optional)',
                      placeholder: 'e.g., john@example.com',
                      value: filterEmail,
                      onChange: setFilterEmail,
                    },
                    {
                      name: 'sort',
                      label: 'Sort By (optional)',
                      placeholder: 'e.g., created_at',
                      value: sortBy,
                      onChange: setSortBy,
                    },
                  ]}
                  onExecute={async () => {
                    return await apiClient.getUsers({
                      page: listPage,
                      per_page: parseInt(listPerPage) || 10,
                      filter: filterEmail ? { email: filterEmail } : undefined,
                      sort: sortBy || undefined,
                    });
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="get" className="font-mono">GET</Badge>
                  <span>/users/:id</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="Get Specific User"
                  description="Retrieve detailed information about a specific user"
                  endpoint="GET /users/{user_id}"
                  parameters={[
                    {
                      name: 'user_id',
                      label: 'User ID',
                      placeholder: 'e.g., 609d7ce223411',
                      value: userId,
                      onChange: setUserId,
                      required: true,
                    },
                  ]}
                  onExecute={async () => {
                    if (!userId) throw new Error('User ID is required');
                    return await apiClient.getUser(userId);
                  }}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant="delete" className="font-mono">DELETE</Badge>
                  <span>/users/:id</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ApiTestGet
                  title="Delete User"
                  description="Delete a user from your organization. Optionally reassign their assets to another user."
                  endpoint="DELETE /users/{user_id}"
                  parameters={[
                    {
                      name: 'user_id',
                      label: 'User ID to Delete',
                      placeholder: 'e.g., 609d7ce223411',
                      value: deleteUserId,
                      onChange: setDeleteUserId,
                      required: true,
                    },
                    {
                      name: 'user_to_reassign',
                      label: 'Reassign Assets To (optional)',
                      placeholder: 'e.g., 507b9de116822',
                      value: reassignTo,
                      onChange: setReassignTo,
                    },
                  ]}
                  onExecute={async () => {
                    if (!deleteUserId) throw new Error('User ID is required');
                    return await apiClient.deleteUser(deleteUserId, reassignTo || undefined);
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
