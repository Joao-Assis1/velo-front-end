"use client";

import Link from "next/link";
import { GraduationCap, Briefcase, ChevronRight } from "lucide-react";

const VeloLogo = () => (
  <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
    <polygon points="3,7 13,7 20,24 27,7 37,7 24,35 16,35" fill="#2563eb" />
    <polygon points="3,7 9,7 16,24 20,24 13,7" fill="#1d4ed8" opacity="0.3" />
    <rect x="1" y="28" width="8" height="2" rx="1" fill="#2563eb" opacity="0.4" />
  </svg>
);

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row md:h-screen md:overflow-hidden">

      {/* Brand panel */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between p-8 md:p-12 md:w-[45%] lg:w-1/2 md:h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/6 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <VeloLogo />
          </div>
          <span className="text-xl font-black tracking-tighter">VELO</span>
        </div>

        <div className="hidden md:block space-y-4 relative z-10">
          <h2 className="text-4xl font-bold leading-snug">Crie sua conta<br />e comece hoje.</h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            Junte-se a milhares de alunos e instrutores que já usam o Velo para simplificar o processo de habilitação.
          </p>
        </div>

        <div className="md:hidden py-4 relative z-10">
          <h2 className="text-2xl font-bold">Criar conta no Velo</h2>
          <p className="text-slate-400 mt-1 text-sm">Selecione seu perfil para continuar.</p>
        </div>

        <p className="hidden md:block text-slate-600 text-xs relative z-10">© 2025 Velo · Direção segura, futuro certo.</p>
      </div>

      {/* Selection panel */}
      <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto">
        <div className="flex flex-col flex-1 p-6 md:p-12 lg:p-16 justify-center">
          <div className="w-full max-w-sm mx-auto md:mx-0">

            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Como vai usar o Velo?</h1>
              <p className="text-slate-500 mt-1 text-sm">Escolha seu perfil para criar sua conta.</p>
            </div>

            <div className="space-y-4">
              <Link
                href="/auth/register/student"
                className="group w-full bg-white border-2 border-slate-100 hover:border-blue-600 hover:shadow-md rounded-2xl p-5 flex items-center gap-4 transition-all"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                  <GraduationCap size={22} className="text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">Sou Aluno</p>
                  <p className="text-sm text-slate-500 mt-0.5">Quero tirar minha habilitação</p>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
              </Link>

              <Link
                href="/auth/register/instructor"
                className="group w-full bg-white border-2 border-slate-100 hover:border-blue-600 hover:shadow-md rounded-2xl p-5 flex items-center gap-4 transition-all"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                  <Briefcase size={22} className="text-slate-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900">Sou Instrutor</p>
                  <p className="text-sm text-slate-500 mt-0.5">Quero gerenciar minha agenda</p>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
              </Link>
            </div>

            <p className="mt-8 text-sm text-slate-500 text-center">
              Já tem conta?{" "}
              <Link href="/auth/login" className="text-blue-600 font-bold hover:underline underline-offset-2">
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
