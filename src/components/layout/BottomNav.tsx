"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, CreditCard, User, BookOpen, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const studentNav = [
  { icon: Home, label: 'Início', href: '/app/student/dashboard' },
  { icon: Calendar, label: 'Agenda', href: '/app/student/schedule' },
  { icon: Users, label: 'Instrutores', href: '/app/student/instructors' },
  { icon: CreditCard, label: 'Pagamentos', href: '/app/student/payments' },
  { icon: User, label: 'Perfil', href: '/app/student/profile' },
];

const instructorNav = [
  { icon: Home, label: 'Início', href: '/app/instructor/dashboard' },
  { icon: Calendar, label: 'Agenda', href: '/app/instructor/schedule' },
  { icon: CreditCard, label: 'Finanças', href: '/app/instructor/finance' },
  { icon: User, label: 'Perfil', href: '/app/instructor/profile' },
  { icon: Settings, label: 'Config', href: '/app/instructor/settings' },
];

export const BottomNav = () => {
  const pathname = usePathname();
  const isInstructor = pathname.startsWith('/app/instructor');
  const navItems = isInstructor ? instructorNav : studentNav;

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
