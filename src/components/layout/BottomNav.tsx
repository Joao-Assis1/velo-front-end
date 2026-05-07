"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Início', href: '/app' },
  { icon: Calendar, label: 'Agenda', href: '/app/schedule' },
  { icon: Users, label: 'Alunos', href: '/app/students' },
  { icon: User, label: 'Perfil', href: '/app/profile' },
  { icon: Settings, label: 'Config', href: '/app/settings' },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-around h-full px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center flex-1 gap-1 py-1 rounded-xl transition-all duration-300 relative",
              isActive ? "text-velo-blue scale-110" : "text-slate-400"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-lg transition-colors",
              isActive && "bg-blue-50"
            )}>
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-bold tracking-tight uppercase transition-all",
              isActive ? "opacity-100 mt-0" : "opacity-0 -mt-2"
            )}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute -top-1 w-8 h-1 bg-velo-blue rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
};
