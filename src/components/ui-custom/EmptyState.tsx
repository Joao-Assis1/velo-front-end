import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon: Icon, title, description, className, action }: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6 text-center animate-in fade-in duration-500", className)}>
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">{description}</p>
      {action}
    </div>
  );
};
