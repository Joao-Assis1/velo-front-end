"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Lock, ChevronRight, Check, Banknote, AlertTriangle, Loader2, ExternalLink, ShieldCheck } from 'lucide-react';
import { Input, Button } from '@/components/ui-custom';
import { useApp } from '@/context/AppContext';
import { forgotPasswordAction, resetPasswordAction } from '@/lib/actions/auth';
import { getConnectStatusAction, startConnectOnboardingAction, type ConnectStatus } from '@/lib/actions/connect';

function ConnectSection() {
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getConnectStatusAction().then((res) => {
      if (res.success && res.data) setStatus(res.data);
      setLoading(false);
    });
  }, []);

  const handleOnboard = async () => {
    setActionLoading(true);
    setError('');
    try {
      const res = await startConnectOnboardingAction();
      if (!res.success || !res.data?.url) {
        setError(res.error ?? 'Erro ao iniciar cadastro. Tente novamente.');
        return;
      }
      window.location.href = res.data.url;
    } catch {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setActionLoading(true);
    setError('');
    try {
      const res = await getConnectStatusAction();
      if (res.success && res.data) setStatus(res.data);
    } catch {
      setError('Não foi possível verificar o status.');
    } finally {
      setActionLoading(false);
    }
  };

  const accountStatus = status?.stripeAccountStatus ?? 'PENDING';
  const payoutsEnabled = status?.stripePayoutsEnabled ?? false;

  if (loading) return <div className="h-16 bg-slate-100 rounded-2xl animate-pulse" />;

  if (accountStatus === 'ACTIVE' && payoutsEnabled) {
    return (
      <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="block font-semibold text-slate-700 text-sm">Conta de Recebimento</span>
            <span className="text-xs text-green-600 font-medium">Conta conectada · Recebimentos habilitados</span>
          </div>
        </div>
        <button onClick={handleOnboard} disabled={actionLoading} className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors">
          Gerenciar
        </button>
      </div>
    );
  }

  if (accountStatus === 'ONBOARDING') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-white border border-amber-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
              <Banknote size={18} />
            </div>
            <div>
              <span className="block font-semibold text-slate-700 text-sm">Conta de Recebimento</span>
              <span className="text-xs text-amber-600 font-medium">Cadastro em análise pelo Stripe</span>
            </div>
          </div>
          <button onClick={handleRefreshStatus} disabled={actionLoading} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : 'Atualizar'}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 px-1">{error}</p>}
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleOnboard} disabled={actionLoading}>
          {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <ExternalLink size={16} />}
          Continuar cadastro no Stripe
        </Button>
      </div>
    );
  }

  if (accountStatus === 'RESTRICTED') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-white border border-red-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <div>
              <span className="block font-semibold text-slate-700 text-sm">Conta de Recebimento</span>
              <span className="text-xs text-red-600 font-medium">Conta restrita pelo Stripe</span>
            </div>
          </div>
        </div>
        {error && <p className="text-xs text-red-500 px-1">{error}</p>}
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleOnboard} disabled={actionLoading}>
          {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <ExternalLink size={16} />}
          Resolver pendências no Stripe
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Banknote size={18} />
          </div>
          <div>
            <span className="block font-semibold text-slate-700 text-sm">Conta de Recebimento</span>
            <span className="text-xs text-slate-500">Configure para receber o valor das suas aulas</span>
          </div>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 px-1">{error}</p>}
      <button
        onClick={handleOnboard}
        disabled={actionLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
      >
        {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <ExternalLink size={16} />}
        Conectar conta bancária via Stripe
      </button>
      <p className="text-xs text-slate-400 text-center px-2">
        Você será redirecionado ao Stripe para cadastrar seus dados bancários com segurança.
      </p>
    </div>
  );
}

export const InstructorSettings = ({ onBack }: { onBack: () => void }) => {
  const { instructorProfile } = useApp();
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
    const email = instructorProfile?.email;
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
    <div className="pb-28 md:pb-10">

      {/* Hero strip */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 -mx-4 md:-mx-8 -mt-6 px-4 md:px-8 pt-6 pb-5 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <button onClick={onBack} className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors mb-3 text-xs font-semibold">
            <ChevronLeft size={15} /> Voltar
          </button>
          <h1 className="text-2xl font-black text-white tracking-tight">Configurações</h1>
          <p className="text-slate-400 text-xs mt-0.5">Privacidade, segurança e recebimentos</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 mb-3">Recebimentos</p>
          <ConnectSection />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 mb-3">Segurança</p>
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group active:scale-[0.98] shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Lock size={18} />
                </div>
                <div className="text-left">
                  <span className="block font-semibold text-slate-700 text-sm">Redefinir Senha</span>
                  <span className="text-xs text-slate-500">Altere sua senha de acesso</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </button>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="font-bold text-slate-900 mb-4 text-sm">Redefinir Senha</h3>
              {error && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
                  {error}
                </div>
              )}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="new-password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Nova Senha</label>
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
                  <label htmlFor="confirm-password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmar Nova Senha</label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-1">
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
                    {isSaved ? <Check size={18} /> : loading ? 'Salvando...' : 'Salvar Senha'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-4">
          Painel do Instrutor
        </p>
      </div>
    </div>
  );
};
