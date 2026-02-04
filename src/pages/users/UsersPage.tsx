import { useEffect, useState } from 'react';
import { Plus, Edit, UserCheck, UserX } from 'lucide-react';
import { useAuthStore } from '@/contexts/AuthContext';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  EmptyState,
} from '@/components/ui';
import { toast } from 'sonner';
import type { User } from '@/types';

// Mock data - replace with actual API calls when backend is ready
const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@example.com',
    first_name: 'Admin',
    last_name: 'User',
    full_name: 'Admin User',
    role: 'admin',
    is_active: true,
    date_joined: '2024-01-01T00:00:00Z',
    last_login: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    email: 'editor@example.com',
    first_name: 'John',
    last_name: 'Editor',
    full_name: 'John Editor',
    role: 'editor',
    is_active: true,
    date_joined: '2024-01-05T00:00:00Z',
    last_login: '2024-01-14T15:30:00Z',
  },
];

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchUsers = async () => {
    //   const response = await usersApi.list();
    //   setUsers(response.results);
    // };
    // fetchUsers();
    
    // Mock data for now
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleToggleStatus = async (user: User) => {
    // TODO: Implement when backend API is ready
    toast.info('User management API not yet implemented');
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Users</h1>
        <Button onClick={() => toast.info('User creation not yet implemented')}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {users.length === 0 ? (
            <EmptyState
              title="No users found"
              description="Add users to give them access to the dashboard"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.full_name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={user.role === 'admin' ? 'danger' : 'default'}
                        >
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={user.is_active ? 'success' : 'default'}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {user.last_login
                            ? new Date(user.last_login).toLocaleDateString()
                            : 'Never'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toast.info('Edit not yet implemented')}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`rounded-lg p-2 ${
                              user.is_active
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={user.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {user.is_active ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note */}
      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
        <p className="font-medium">Note:</p>
        <p>
          User management API endpoints need to be implemented on the backend.
          This page currently shows mock data.
        </p>
      </div>
    </div>
  );
}
