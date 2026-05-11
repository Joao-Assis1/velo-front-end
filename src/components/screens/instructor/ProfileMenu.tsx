"use client";

import React from 'react';
import { motion } from 'motion/react';
import { User, Car, Calendar, CreditCard, LogOut, ChevronRight, Settings, ShieldCheck, Star } from 'lucide-react';
import { Card } from '@/components/ui-custom';
import { Instructor, Screen } from '@/types';

export const InstructorProfileMenu = ({ 
  profile, 
  onNavigate, 
  onLogout 
}: { 
  profile: Instructor | null, 
  onNavigate: (screen: Screen) => void, 
  onLogout: () => void 
}) => {
  const menuItems = [
    { id: 'instructor-edit-profile', label: 'Dados Profissionais', icon: User, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'instructor-vehicle', label: 'Veículo', icon: Car, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'instructor-finance', label: 'Financeiro', icon: CreditCard, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 'instructor-settings', label: 'Configurações', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-50' },
  ];

  return (
    <div className="pb-28 md:pb-10 space-y-6">
      <header className="text-center pt-4 pb-2">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md bg-slate-100 flex items-center justify-center">
            {profile ? (
              profile.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-2xl">
                  {profile.name?.charAt(0)?.toUpperCase()}
                </div>
              )
            ) : (
              <div className="animate-pulse w-full h-full bg-slate-200"></div>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-white text-slate-900 p-1.5 rounded-full border-2 border-slate-100 shadow-sm flex items-center gap-0.5">
            <Star size={10} fill="currentColor" className="text-yellow-400" />
            <span className="text-[10px] font-bold">{profile?.rating || '0.0'}</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{profile?.name || "Carregando..."}</h1>
        <p className="text-slate-500 text-sm">Instrutor {profile?.instructorType || 'Velo'}</p>
      </header>

      <div className="grid grid-cols-1 gap-3">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onNavigate(item.id as Screen)}
            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group active:scale-[0.98]"
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
          className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors active:scale-[0.98]"
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      </div>

      <div className="pt-8 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Painel do Instrutor • v0.1.0</p>
      </div>
    </div>
  );
};
