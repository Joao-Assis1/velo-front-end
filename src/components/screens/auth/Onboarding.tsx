"use client";

import React from 'react';
import { motion } from 'motion/react';
import { Car, GraduationCap, Briefcase } from 'lucide-react';
import { UserRole } from '@/types';

export const Onboarding = ({ onSelectRole }: { onSelectRole: (role: UserRole) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col md:flex-row md:h-screen md:overflow-hidden"
    >
      {/* ── Left brand panel ── */}
      <div className="bg-velo-blue text-white flex flex-col justify-between p-10 md:p-14 md:w-[45%] lg:w-1/2 md:h-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Car size={18} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">VELO</span>
        </div>

        {/* Mobile: compact */}
        <div className="md:hidden py-8 text-center">
          <h1 className="text-3xl font-bold">Bem-vindo ao Velo</h1>
          <p className="text-blue-200 mt-2 text-base">Escolha seu perfil para começar.</p>
        </div>

        {/* Desktop: full content */}
        <div className="hidden md:block space-y-4">
          <h1 className="text-5xl font-bold leading-tight">
            Bem-vindo<br />ao Velo.
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed max-w-sm">
            A plataforma que conecta alunos aos melhores instrutores de trânsito do Brasil.
          </p>
        </div>

        <p className="hidden md:block text-blue-400 text-xs">© 2025 Velo · Direção segura, futuro certo.</p>
      </div>

      {/* ── Right selection panel ── */}
      <div className="flex-1 bg-white flex items-center justify-center p-8 md:p-16 overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              Começar
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Como você vai usar o Velo?
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Escolha seu perfil para continuar.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => onSelectRole('student')}
              aria-pressed={false}
              className="w-full group flex items-center gap-5 p-5 rounded-2xl border-2 border-slate-200 hover:border-velo-blue hover:bg-blue-50/30 transition-colors duration-200 text-left"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-velo-blue group-hover:text-white transition-colors text-velo-blue">
                <GraduationCap size={22} />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-base">Sou Aluno</p>
                <p className="text-slate-500 text-sm mt-0.5">
                  Quero encontrar instrutores e agendar aulas
                </p>
              </div>
            </button>

            <button
              onClick={() => onSelectRole('instructor')}
              aria-pressed={false}
              className="w-full group flex items-center gap-5 p-5 rounded-2xl border-2 border-slate-200 hover:border-velo-blue hover:bg-blue-50/30 transition-colors duration-200 text-left"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-velo-blue group-hover:text-white transition-colors text-velo-blue">
                <Briefcase size={22} />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-base">Sou Instrutor</p>
                <p className="text-slate-500 text-sm mt-0.5">
                  Quero gerenciar alunos e minha agenda
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
