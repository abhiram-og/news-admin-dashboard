import { useState } from 'react';
import { User, Mail, Shield, Key } from 'lucide-react';
import { useAuthStore } from '@/contexts/AuthContext';
import { authApi } from '@/api/auth';
import {
  Button,
  Input,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@/components/ui';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user } = useAuthStore();
  
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};

    if (!passwordData.old_password) {
      errors.old_password = 'Current password is required';
    }
    if (!passwordData.new_password) {
      errors.new_password = 'New password is required';
    } else if (passwordData.new_password.length < 8) {
      errors.new_password = 'Password must be at least 8 characters';
    }
    if (passwordData.new_password !== passwordData.new_password_confirm) {
      errors.new_password_confirm = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setIsChangingPassword(true);

    try {
      await authApi.changePassword(passwordData);
      toast.success('Password changed successfully');
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
      });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Profile Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.full_name}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant={user.role === 'admin' ? 'danger' : 'default'}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4 pt-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Email</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Role</p>
                <p className="text-sm text-gray-600 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.old_password}
              onChange={(e) =>
                setPasswordData({ ...passwordData, old_password: e.target.value })
              }
              error={passwordErrors.old_password}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={passwordData.new_password}
              onChange={(e) =>
                setPasswordData({ ...passwordData, new_password: e.target.value })
              }
              error={passwordErrors.new_password}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.new_password_confirm}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  new_password_confirm: e.target.value,
                })
              }
              error={passwordErrors.new_password_confirm}
              required
            />
            <Button
              type="submit"
              isLoading={isChangingPassword}
              className="w-full"
            >
              <Key className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
