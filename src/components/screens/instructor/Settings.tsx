"use client";

import React, { useState } from 'react';
import { ChevronLeft, Lock, ChevronRight, Check } from 'lucide-react';
import { Input, Button, Card } from '@/components/ui-custom';

export const InstructorSettings = ({ 
  onBack 
}: { 
  onBack: () => void 
}) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [isSaved, setIsSaved] = useState(false);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new === passwords.confirm && passwords.new !== '') {
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setShowPasswordForm(false);
        setPasswords({ new: '', confirm: '' });
      }, 2000);
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 space-y-6">
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
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Nova Senha</label>
                <Input 
                  type="password"
                  placeholder="••••••••"
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Confirmar Nova Senha</label>
                <Input 
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
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={isSaved}>
                  {isSaved ? <Check size={20} /> : 'Salvar Senha'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>

      <div className="pt-8 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Painel do Instrutor • v0.1.0</p>
      </div>
    </div>
  );
};
