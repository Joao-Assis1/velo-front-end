"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ui-custom/ConfirmDialog';
import Image from 'next/image';
import {
  Home,
  Calendar,
  CreditCard,
  User,
  Settings,
  LogOut,
  ChevronRight,
  BookOpen,
  Users,
  Compass,
  FileText,
  Stethoscope,
  Brain,
  GraduationCap,
  IdCard,
  Scale,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

const studentNav = [
  { icon: Home, label: 'Início', href: '/app/student/dashboard' },
  { icon: Compass, label: 'Minha Jornada', href: '/app/student/concierge' },
  { icon: BookOpen, label: 'Curso teórico', href: '/app/student/theory-course' },
  { icon: FileText, label: 'RENACH', href: '/app/student/renach' },
  { icon: Stethoscope, label: 'Exame médico', href: '/app/student/exams/medical' },
  { icon: Brain, label: 'Exame psicológico', href: '/app/student/exams/psychological' },
  { icon: GraduationCap, label: 'Exame teórico', href: '/app/student/exams/theory-official' },
  { icon: IdCard, label: 'LADV', href: '/app/student/ladv' },
  { icon: Calendar, label: 'Agenda', href: '/app/student/schedule' },
  { icon: BookOpen, label: 'Progresso', href: '/app/student/progress' },
  { icon: Users, label: 'Instrutores', href: '/app/student/instructors' },
  { icon: CreditCard, label: 'Pagamentos', href: '/app/student/payments' },
  { icon: Scale, label: 'Disputas', href: '/app/student/dispute' },
  { icon: User, label: 'Meu Perfil', href: '/app/student/profile' },
  { icon: Settings, label: 'Configurações', href: '/app/student/settings' },
];

const instructorNav = [
  { icon: Home, label: 'Início', href: '/app/instructor/dashboard' },
  { icon: Calendar, label: 'Agenda', href: '/app/instructor/schedule' },
  { icon: CreditCard, label: 'Financeiro', href: '/app/instructor/finance' },
  { icon: User, label: 'Meu Perfil', href: '/app/instructor/profile' },
  { icon: Settings, label: 'Configurações', href: '/app/instructor/settings' },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { instructorProfile, studentProfile, logout } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isInstructor = pathname.startsWith('/app/instructor');
  const navItems = isInstructor ? instructorNav : studentNav;
  const profile = isInstructor ? instructorProfile : studentProfile;

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      <div className="p-6">
        <Link href={isInstructor ? '/app/instructor/dashboard' : '/app/student/dashboard'} className="group">
          <Image
            src="/logo.svg"
            alt="Velo"
            width={100}
            height={33}
            className="group-hover:opacity-80 transition-opacity"
            priority
            unoptimized
          />
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
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-sm">
                  {(profile?.name || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{profile?.name || 'Carregando...'}</p>
              <p className="text-xs text-slate-500 truncate">{profile?.email || ''}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setConfirmOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
        >
          <LogOut size={22} className="text-slate-400 group-hover:text-red-500" />
          <span className="font-semibold">Sair da Conta</span>
        </button>
        <ConfirmDialog
          open={confirmOpen}
          title="Sair da conta"
          description="Tem certeza que deseja sair? Você precisará fazer login novamente."
          confirmLabel="Sair"
          cancelLabel="Cancelar"
          destructive
          onConfirm={() => { setConfirmOpen(false); logout(); router.push('/auth/login'); }}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </div>
  );
};
