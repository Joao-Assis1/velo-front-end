"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export const Button = ({ 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost',
  size?: 'sm' | 'md' | 'lg'
}) => {
  const variants = {
    primary: 'bg-velo-blue text-white hover:bg-velo-blue-dark shadow-md',
    secondary: 'bg-velo-green text-white hover:bg-velo-green-dark shadow-md',
    outline: 'border-2 border-velo-blue text-velo-blue hover:bg-velo-blue-light',
    ghost: 'text-slate-600 hover:bg-slate-100'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={cn(
        "rounded-xl font-semibold transition-all active:scale-95 flex items-center justify-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export const Card = ({ 
  className, 
  children, 
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-white rounded-2xl shadow-sm border border-slate-100 p-4", className)} {...props}>
    {children}
  </div>
);

export const Input = ({ 
  className, 
  icon, 
  ...props 
}: React.InputHTMLAttributes<HTMLInputElement> & { 
  icon?: React.ReactNode 
}) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        {icon}
      </div>
    )}
    <input 
      className={cn(
        "w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-velo-blue/20 transition-all",
        icon && "pl-10",
        className
      )}
      {...props}
    />
  </div>
);

export * from './CalendarWidget';
