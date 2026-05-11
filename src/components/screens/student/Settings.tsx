"use client";

import React, { useState } from 'react';
import { ChevronLeft, Lock, ChevronRight, Check } from 'lucide-react';
import { Input, Button, Card } from '@/components/ui-custom';
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

  return (
    <div className="pb-28 md:pb-10 space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
          <p className="text-slate-500 text-sm">Privacidade e segurança da sua conta</p>
        </div>
      </header>

      <div className="space-y-4">
        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div className="text-left">
                <span className="block font-bold text-slate-700">Redefinir Senha</span>
                <span className="text-xs text-slate-500">Altere sua senha de acesso</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
          </button>
        ) : (
          <Card className="p-6 border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="font-bold text-slate-900 mb-4">Redefinir Senha</h3>
            {error && (
              <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="new-password" className="text-sm font-bold text-slate-700 ml-1">Nova Senha</label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="confirm-password" className="text-sm font-bold text-slate-700 ml-1">Confirmar Nova Senha</label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setShowPasswordForm(false); setError(''); setPasswords({ new: '', confirm: '' }); }}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={loading || isSaved}>
                  {isSaved ? <Check size={20} /> : loading ? 'Salvando...' : 'Salvar Senha'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>

      <div className="pt-8 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Velo App • v0.1.0</p>
      </div>
    </div>
  );
};
