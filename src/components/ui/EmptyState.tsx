import { FileText, Search } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: 'file' | 'search';
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = 'file',
  action,
  className,
}: EmptyStateProps) {
  const Icon = icon === 'search' ? Search : FileText;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
