"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 border border-slate-100 rounded-2xl shadow-sm space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl font-black italic text-white">V</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Criar conta no Velo</h1>
          <p className="text-sm text-slate-500 mt-1">Selecione seu perfil para continuar</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/auth/register/student"
            className="flex flex-col items-center gap-3 p-6 border-2 border-slate-200 rounded-2xl active:border-blue-500 active:bg-blue-50 transition-all"
          >
            <span className="text-4xl select-none">🎓</span>
            <div className="text-center">
              <p className="font-bold text-slate-800">Aluno</p>
              <p className="text-xs text-slate-500 mt-0.5">Quero aprender a dirigir</p>
            </div>
          </Link>

          <Link
            href="/auth/register/instructor"
            className="flex flex-col items-center gap-3 p-6 border-2 border-slate-200 rounded-2xl active:border-blue-500 active:bg-blue-50 transition-all"
          >
            <span className="text-4xl select-none">🚗</span>
            <div className="text-center">
              <p className="font-bold text-slate-800">Instrutor</p>
              <p className="text-xs text-slate-500 mt-0.5">Quero dar aulas</p>
            </div>
          </Link>
        </div>

        <p className="text-center text-sm text-slate-500">
          Já tem conta?{" "}
          <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
