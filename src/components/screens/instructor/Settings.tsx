"use client";

import React, { useState } from 'react';
import { ChevronLeft, Lock, ChevronRight, Check, Banknote, Pencil } from 'lucide-react';
import { Input, Button } from '@/components/ui-custom';
import { useApp } from '@/context/AppContext';
import { forgotPasswordAction, resetPasswordAction } from '@/lib/actions/auth';
import { updateInstructorProfileAction } from '@/lib/actions/instructors';
import { cn } from '@/lib/utils';

const PIX_TYPE_LABELS: Record<string, string> = {
  CPF: 'CPF',
  CNPJ: 'CNPJ',
  EMAIL: 'E-mail',
  PHONE: 'Telefone',
  EVP: 'Chave aleatória',
};

function PixKeySection() {
  const { instructorProfile, setInstructorProfile } = useApp();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pixKeyType, setPixKeyType] = useState<string>(instructorProfile?.pixKeyType ?? '');
  const [pixKey, setPixKey] = useState(instructorProfile?.pixKey ?? '');

  const handleSave = async () => {
    if (!instructorProfile?.id) return;
    if (!pixKeyType || !pixKey.trim()) {
      setError('Selecione o tipo e informe a chave PIX.');
      return;
    }
    setLoading(true);
    setError('');
    const res = await updateInstructorProfileAction(instructorProfile.id, { pixKeyType: pixKeyType as any, pixKey: pixKey.trim() });
    setLoading(false);
    if (res.success) {
      if (instructorProfile) {
        setInstructorProfile({ ...instructorProfile, pixKeyType: pixKeyType as any, pixKey: pixKey.trim() });
      }
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(res.error ?? 'Erro ao salvar chave PIX.');
    }
  };

  const hasKey = !!instructorProfile?.pixKey;

  if (!editing) {
    return (
      <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Banknote size={18} />
          </div>
          <div>
            <span className="block font-semibold text-slate-700 text-sm">Chave PIX</span>
            {hasKey ? (
              <span className="text-xs text-slate-500">
                {PIX_TYPE_LABELS[instructorProfile!.pixKeyType!] ?? instructorProfile!.pixKeyType}: {instructorProfile!.pixKey}
              </span>
            ) : (
              <span className="text-xs text-slate-400">Não cadastrada</span>
            )}
            {success && <span className="block text-xs text-green-600 font-medium mt-0.5">Salvo com sucesso!</span>}
          </div>
        </div>
        <button
          onClick={() => {
            setPixKeyType(instructorProfile?.pixKeyType ?? '');
            setPixKey(instructorProfile?.pixKey ?? '');
            setError('');
            setEditing(true);
          }}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
        >
          <Pencil size={13} />
          {hasKey ? 'Editar' : 'Cadastrar'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <h3 className="font-bold text-slate-900 mb-4 text-sm">Chave PIX para Recebimentos</h3>
      {error && (
        <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo de Chave</label>
          <select
            value={pixKeyType}
            onChange={(e) => setPixKeyType(e.target.value)}
            className={cn(
              'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all',
            )}
          >
            <option value="">Selecione o tipo</option>
            {Object.entries(PIX_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Chave PIX</label>
          <Input
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            placeholder="Digite sua chave PIX"
          />
        </div>
        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => { setEditing(false); setError(''); }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="button" className="flex-1" onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
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
          <p className="text-slate-400 text-xs mt-0.5">Privacidade, segurança e chave PIX</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1 mb-3">Recebimentos</p>
          <PixKeySection />
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
