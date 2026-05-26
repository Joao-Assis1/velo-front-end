"use client";

import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, Briefcase, ChevronRight } from 'lucide-react';
import { UserRole } from '@/types';

export const Onboarding = ({ onSelectRole }: { onSelectRole: (role: UserRole) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col md:flex-row md:h-screen md:overflow-hidden"
    >
      {/* Brand panel */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between p-10 md:p-14 md:w-[45%] lg:w-1/2 md:h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/6 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
              <polygon points="3,7 13,7 20,24 27,7 37,7 24,35 16,35" fill="white" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tighter">VELO</span>
        </div>

        <div className="md:hidden py-8 text-center relative z-10">
          <h1 className="text-3xl font-bold">Bem-vindo ao Velo</h1>
          <p className="text-blue-400 mt-2 text-base">Escolha seu perfil para começar.</p>
        </div>

        <div className="hidden md:block space-y-4 relative z-10">
          <h1 className="text-5xl font-bold leading-tight">
            Bem-vindo<br />ao Velo.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
            A plataforma que conecta alunos aos melhores instrutores de trânsito do Brasil.
          </p>
        </div>

        <p className="hidden md:block text-slate-600 text-xs relative z-10">© 2025 Velo · Direção segura, futuro certo.</p>
      </div>

      {/* Selection panel */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-8 md:p-16 overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Começar</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Como vai usar o Velo?
            </h2>
            <p className="text-slate-500 mt-2 text-sm">Escolha seu perfil para continuar.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => onSelectRole('student')}
              className="w-full bg-white border-2 border-slate-100 hover:border-blue-600 hover:shadow-md rounded-2xl p-5 flex items-center gap-4 text-left transition-all group"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                <GraduationCap size={22} className="text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900">Sou Aluno</p>
                <p className="text-sm text-slate-500 mt-0.5">Quero tirar minha habilitação</p>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
            </button>

            <button
              onClick={() => onSelectRole('instructor')}
              className="w-full bg-white border-2 border-slate-100 hover:border-blue-600 hover:shadow-md rounded-2xl p-5 flex items-center gap-4 text-left transition-all group"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                <Briefcase size={22} className="text-slate-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900">Sou Instrutor</p>
                <p className="text-sm text-slate-500 mt-0.5">Quero gerenciar minha agenda</p>
              </div>
              <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
