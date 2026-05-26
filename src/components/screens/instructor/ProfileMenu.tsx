"use client";

import React from 'react';
import { motion } from 'motion/react';
import { User, Car, Calendar, CreditCard, LogOut, ChevronRight, Settings, Star } from 'lucide-react';
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
    { id: 'instructor-edit-profile', label: 'Dados Profissionais', icon: User, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { id: 'instructor-vehicle', label: 'Veículo', icon: Car, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { id: 'instructor-finance', label: 'Financeiro', icon: CreditCard, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
    { id: 'instructor-settings', label: 'Configurações', icon: Settings, iconBg: 'bg-slate-100', iconColor: 'text-slate-500' },
  ];

  return (
    <div className="pb-28 md:pb-10">

      {/* Hero strip */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 -mx-4 md:-mx-8 -mt-6 px-4 md:px-8 pt-8 pb-6 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-white/20 bg-white/10 flex items-center justify-center">
              {profile?.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-2xl">
                  {profile?.name?.charAt(0)?.toUpperCase() ?? '?'}
                </span>
              )}
            </div>
            {profile?.rating !== undefined && (
              <div className="absolute -bottom-1 -right-1 bg-white text-slate-900 px-1.5 py-0.5 rounded-full border-2 border-white/20 shadow-sm flex items-center gap-0.5">
                <Star size={9} fill="currentColor" className="text-yellow-400" />
                <span className="text-[10px] font-black">{profile.rating || '0.0'}</span>
              </div>
            )}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-black text-white">
              {profile?.name || 'Carregando...'}
            </h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              Instrutor {profile?.instructorType || 'Velo'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto space-y-6">
        {/* Menu items */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 mb-2">Minha conta</p>
          {menuItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onNavigate(item.id as Screen)}
              className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group active:scale-[0.98] shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 ${item.iconBg} ${item.iconColor} rounded-xl flex items-center justify-center`}>
                  <item.icon size={18} />
                </div>
                <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </motion.button>
          ))}
        </div>

        {/* Logout */}
        <div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-semibold text-sm hover:bg-red-50 rounded-2xl transition-colors active:scale-[0.98] border border-red-100"
          >
            <LogOut size={18} />
            Sair da Conta
          </button>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">
          Painel do Instrutor
        </p>
      </div>
    </div>
  );
};
