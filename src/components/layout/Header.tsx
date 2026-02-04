import { useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { cn } from '@/utils/cn';

interface HeaderProps {
  onMenuClick?: () => void;
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/articles': 'Articles',
  '/articles/new': 'New Article',
  '/categories': 'Categories',
  '/users': 'Users',
  '/profile': 'Profile',
};

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();

  // Get page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    
    // Check for edit article page
    if (path.match(/\/articles\/\d+\/edit/)) {
      return 'Edit Article';
    }
    
    return pageTitles[path] || 'Dashboard';
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
}
