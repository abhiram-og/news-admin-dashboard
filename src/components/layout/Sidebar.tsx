import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  UserCircle,
  LogOut,
  Newspaper,
} from 'lucide-react';
import { useAuthStore } from '@/contexts/AuthContext';
import { authApi } from '@/api/auth';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Articles', href: '/articles', icon: FileText },
  { label: 'Categories', href: '/categories', icon: FolderOpen },
  { label: 'Users', href: '/users', icon: Users, adminOnly: true },
];

export function Sidebar() {
  const { user, logout, isAdmin } = useAuthStore();

  const handleLogout = async () => {
    try {
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // Ignore logout errors
    } finally {
      logout();
      toast.success('Logged out successfully');
    }
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin()
  );

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Newspaper className="h-6 w-6 text-primary-600" />
        <span className="ml-2 text-lg font-semibold text-gray-900">
          News Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200 p-4">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            )
          }
        >
          <UserCircle className="mr-3 h-5 w-5" />
          Profile
        </NavLink>

        {user && (
          <div className="mt-4 flex items-center px-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user.full_name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
