import { cn } from '@/utils/cn';
import type { PublishStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-gray-100 text-gray-800': variant === 'default',
          'bg-green-100 text-green-800': variant === 'success',
          'bg-yellow-100 text-yellow-800': variant === 'warning',
          'bg-red-100 text-red-800': variant === 'danger',
          'bg-blue-100 text-blue-800': variant === 'info',
        },
        className
      )}
    >
      {children}
    </span>
  );
}

// Status badge for articles
interface StatusBadgeProps {
  status: PublishStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<PublishStatus, { variant: BadgeProps['variant']; label: string }> = {
    draft: { variant: 'default', label: 'Draft' },
    published: { variant: 'success', label: 'Published' },
    archived: { variant: 'warning', label: 'Archived' },
  };

  const { variant, label } = variants[status];

  return <Badge variant={variant}>{label}</Badge>;
}
