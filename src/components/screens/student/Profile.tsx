"use client";

import React from 'react';
import { motion } from 'motion/react';
import { User, Phone, Mail, FileText, CreditCard, LogOut, ChevronRight, Settings, ShieldCheck } from 'lucide-react';
import { Student, Screen } from '@/types';
import { cn } from '@/lib/utils';

export const StudentProfile = ({ 
  profile, 
  onNavigate, 
  onLogout 
}: { 
  profile: Student | null, 
  onNavigate: (screen: Screen) => void, 
  onLogout: () => void 
}) => {
  const menuItems = [
    { id: 'student-personal-data', label: 'Dados Pessoais', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'student-payments', label: 'Pagamentos', icon: CreditCard, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'student-settings', label: 'Configurações', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark header com avatar */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/8 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-2xl mx-auto w-full px-4 md:px-6 pt-8 pb-8 text-center relative z-10">
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-xl bg-white/10 flex items-center justify-center mx-auto">
              {profile ? (
                profile.profilePicture ? (
                  <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-3xl">
                    {profile.name?.charAt(0)?.toUpperCase()}
                  </span>
                )
              ) : (
                <div className="animate-pulse w-full h-full bg-white/20" />
              )}
            </div>

            <div className="absolute -bottom-1 -right-1 bg-velo-green text-white p-1 rounded-full border-2 border-slate-900 shadow-sm">
              <ShieldCheck size={12} fill="currentColor" fillOpacity={0.2} />
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-slate-50">{profile?.name || "Carregando..."}</h1>
          <p className="text-xs font-bold text-blue-400 mt-0.5 tracking-widest uppercase">Aluno ativo</p>
        </div>
      </div>

      {/* Menu items */}
      <div className="w-full px-4 pt-6 pb-28 md:pb-12 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as Screen)}
            className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bg, item.color)}>
                <item.icon size={20} />
              </div>
              <span className="font-bold text-slate-800">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
          </button>
        ))}

        <div className="pt-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-4 bg-white border border-red-100 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-colors active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <LogOut size={18} />
            Sair da conta
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4">
          Versão 0.1.0-alpha
        </p>
      </div>
    </div>
  );
};
