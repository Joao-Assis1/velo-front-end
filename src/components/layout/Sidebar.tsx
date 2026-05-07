"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  Users, 
  User, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Início', href: '/app' },
  { icon: Calendar, label: 'Agenda', href: '/app/schedule' },
  { icon: Users, label: 'Alunos', href: '/app/students' },
  { icon: User, label: 'Meu Perfil', href: '/app/profile' },
  { icon: Settings, label: 'Configurações', href: '/app/settings' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-6">
        <Link href="/app" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-velo-blue rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-xl font-bold italic">V</span>
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter italic">VELO</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-velo-blue text-white shadow-md shadow-velo-blue/20" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-velo-blue"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={22} className={cn(isActive ? "text-white" : "text-slate-400 group-hover:text-velo-blue")} />
                <span className="font-semibold">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} className="text-white/70" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
              <img src="https://ui-avatars.com/api/?name=User" alt="User" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">Nome do Usuário</p>
              <p className="text-xs text-slate-500 truncate">usuario@email.com</p>
            </div>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors group">
          <LogOut size={22} className="text-slate-400 group-hover:text-red-500" />
          <span className="font-semibold">Sair da Conta</span>
        </button>
      </div>
    </div>
  );
};
