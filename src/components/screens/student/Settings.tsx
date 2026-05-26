"use client";

import React, { useState } from 'react';
import { ChevronLeft, Lock, Check, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { forgotPasswordAction, resetPasswordAction } from '@/lib/actions/auth';

export const StudentSettings = ({
  onBack
}: {
  onBack: () => void
}) => {
  const { studentProfile } = useApp();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwords.new.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    const email = studentProfile?.email;
    if (!email) {
      setError('Não foi possível identificar seu e-mail. Tente novamente.');
      return;
    }

    setLoading(true);
    try {
      const forgotResult = await forgotPasswordAction(email);
      if (!forgotResult.success || !forgotResult.token) {
        setError(forgotResult.error || 'Erro ao iniciar redefinição. Tente novamente.');
        return;
      }

      const resetResult = await resetPasswordAction(forgotResult.token, passwords.new);
      if (!resetResult.success) {
        setError(resetResult.error || 'Erro ao redefinir senha. Tente novamente.');
        return;
      }

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setShowPasswordForm(false);
        setPasswords({ new: '', confirm: '' });
      }, 2000);
    } catch {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/8 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-2xl mx-auto w-full px-4 md:px-6 pt-5 pb-6 relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-400">Perfil</p>
          </div>
          <h1 className="text-xl font-extrabold text-slate-50">Configurações</h1>
          <p className="text-xs text-slate-400 mt-0.5">Privacidade e segurança</p>
        </div>
      </div>

      <div className="w-full px-4 pb-28 md:pb-12 pt-6 space-y-3">
        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div className="text-left">
                <span className="block font-bold text-slate-800">Alterar senha</span>
                <span className="text-xs text-slate-500">Redefina sua senha de acesso</span>
              </div>
            </div>
            <ChevronLeft size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors rotate-180" />
          </button>
        ) : (
          <div className={cn(
            "bg-white border rounded-2xl shadow-sm overflow-hidden",
            isSaved ? "border-green-200" : "border-blue-200"
          )}>
            <div className={cn(
              "px-4 py-3 flex items-center gap-3",
              isSaved ? "bg-green-50" : "bg-blue-50"
            )}>
              {isSaved ? (
                <Check size={18} className="text-green-600" />
              ) : (
                <Lock size={18} className="text-blue-600" />
              )}
              <span className={cn("font-bold text-sm", isSaved ? "text-green-700" : "text-blue-700")}>
                {isSaved ? "Senha alterada com sucesso!" : "Alterar senha"}
              </span>
            </div>

            {!isSaved && (
              <form onSubmit={handleResetPassword} className="p-4 space-y-3">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100 font-medium">
                    {error}
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                    Nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      className={inputCls}
                      required
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className={inputCls}
                      required
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => { setShowPasswordForm(false); setError(''); setPasswords({ new: '', confirm: '' }); }}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-2 flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? "Salvando..." : "Confirmar"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
