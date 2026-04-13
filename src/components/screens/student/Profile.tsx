"use client";

import React from 'react';
import { motion } from 'motion/react';
import { User, Phone, Mail, FileText, CreditCard, LogOut, ChevronRight, Settings, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui-custom';
import { Student, Screen } from '@/types';

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

  if (!profile) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-velo-blue"></div>
    </div>
  );

  return (
    <div className="pb-24 pt-6 px-4 space-y-6 bg-white min-h-screen">
      <header className="text-center pt-4 pb-2">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
            <img src={profile.profilePicture || "https://ui-avatars.com/api/?name=User"} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-velo-green text-white p-1.5 rounded-full border-2 border-white shadow-sm">
            <ShieldCheck size={14} fill="currentColor" fillOpacity={0.2} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
        <p className="text-slate-500 text-sm">Aluno Velo • Nível 4</p>
      </header>

      <div className="grid grid-cols-1 gap-3">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id as Screen)}
            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                <item.icon size={20} />
              </div>
              <span className="font-bold text-slate-700">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
          </button>
        ))}
      </div>

      <div className="pt-4">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-all active:scale-[0.98]"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </div>

      <div className="pt-8 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Versão 0.1.0-alpha</p>
      </div>
    </div>
  );
};
