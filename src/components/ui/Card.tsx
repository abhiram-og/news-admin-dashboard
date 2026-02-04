import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return (
    <div className={cn('border-b border-slate-100 px-6 py-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: CardProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-slate-900', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className }: CardProps) {
  return (
    <p className={cn('mt-1 text-sm text-slate-500', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn('p-6', className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4',
        className
      )}
    >
      {children}
    </div>
  );
}
