"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, CreditCard, TrendingUp, ArrowUpRight, ArrowDownLeft, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui-custom';
import { ScheduledClass } from '@/types';

export const InstructorFinance = ({
  classes,
  pixKey,
  onBack
}: {
  classes: ScheduledClass[],
  pixKey?: string,
  onBack: () => void
}) => {
  const completedClasses = classes.filter(c => c.status === 'completed');
  const totalEarnings = completedClasses.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const pendingEarnings = classes.filter(c => c.status === 'upcoming').reduce((acc, curr) => acc + (curr.price || 0), 0);

  return (
    <div className="pb-28 md:pb-10 space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={onBack} aria-label="Voltar" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} aria-hidden="true" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>
          <p className="text-slate-500 text-sm">Gerencie seus ganhos e recebimentos</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none p-6">
          <p className="text-green-100 text-sm font-medium mb-1">Saldo Disponível</p>
          <h2 className="text-3xl font-bold mb-4">
            {totalEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h2>
          <div className="flex items-center gap-2 text-xs bg-white/20 w-fit px-2 py-1 rounded-md">
            <TrendingUp size={14} />
            <span>+12% em relação ao mês anterior</span>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <ArrowUpRight size={14} className="text-green-500" />
              <span>A receber</span>
            </div>
            <p className="font-bold text-slate-900">
              {pendingEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </Card>
          <Card className="p-4 border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <ArrowDownLeft size={14} className="text-blue-500" />
              <span>Transferido</span>
            </div>
            <p className="font-bold text-slate-900">R$ 0,00</p>
          </Card>
        </div>
      </div>

      <section>
        <h3 className="font-bold text-slate-900 mb-4">Histórico de Recebimentos</h3>
        <div className="space-y-3">
          {completedClasses.length > 0 ? (
            completedClasses.map(cls => (
              <div key={cls.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{cls.studentName}</p>
                    <p className="text-xs text-slate-500">{new Date(cls.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <p className="font-bold text-green-600">
                  + {(cls.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm">Nenhum recebimento registrado.</p>
            </div>
          )}
        </div>
      </section>

      {!pixKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-500" />
          <div>
            <p className="text-sm font-bold text-amber-900 mb-1">Chave PIX não cadastrada</p>
            <p className="text-sm text-amber-700">
              Cadastre sua chave PIX para receber os pagamentos das suas aulas.{' '}
              <Link href="/app/instructor/settings" className="underline font-semibold">
                Configurar agora
              </Link>
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <div className="shrink-0 mt-0.5 text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-blue-900 mb-1">Transferências automáticas</p>
          <p className="text-sm text-blue-700">
            Seu saldo é transferido para sua chave PIX em até 5 minutos após cada aula concluída (descontada a taxa da plataforma de 20%).
          </p>
        </div>
      </div>
    </div>
  );
};
