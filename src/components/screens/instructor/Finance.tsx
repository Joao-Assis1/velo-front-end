"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, CreditCard, TrendingUp, ArrowUpRight, ArrowDownLeft, AlertTriangle, Calendar, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui-custom';

export interface EarningsData {
  availableBalance: number;
  pendingBalance: number;
  transferredBalance: number;
  history: Array<{
    id: string;
    studentName: string;
    studentImage?: string;
    date: string | Date;
    price: number;
  }>;
}

export const InstructorFinance = ({
  earningsData,
  stripePayoutsEnabled,
  onBack,
  selectedMonth,
  selectedYear,
  onMonthYearChange,
  isLoading = false
}: {
  earningsData?: EarningsData,
  stripePayoutsEnabled?: boolean,
  onBack: () => void,
  selectedMonth: number,
  selectedYear: number,
  onMonthYearChange: (month: number, year: number) => void,
  isLoading?: boolean
}) => {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear];

  const availableBalance = earningsData?.availableBalance || 0;
  const pendingBalance = earningsData?.pendingBalance || 0;
  const transferredBalance = earningsData?.transferredBalance || 0;
  const history = earningsData?.history || [];

  return (
    <div className="pb-28 md:pb-10 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} aria-label="Voltar" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} aria-hidden="true" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>
            <p className="text-slate-500 text-sm">Gerencie seus ganhos e recebimentos</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <select 
            value={selectedMonth} 
            onChange={(e) => onMonthYearChange(Number(e.target.value), selectedYear)}
            className="bg-transparent text-sm font-medium px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            {months.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <div className="w-px h-4 bg-slate-200" />
          <select 
            value={selectedYear} 
            onChange={(e) => onMonthYearChange(selectedMonth, Number(e.target.value))}
            className="bg-transparent text-sm font-medium px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-velo-blue" size={40} />
          <p className="text-slate-500 font-medium">Carregando dados financeiros...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none p-6">
              <p className="text-green-100 text-sm font-medium mb-1">Saldo Disponível (Líquido)</p>
              <h2 className="text-3xl font-bold mb-4">
                {(availableBalance * 0.8).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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
                  {(pendingBalance * 0.8).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </Card>
              <Card className="p-4 border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                  <ArrowDownLeft size={14} className="text-blue-500" />
                  <span>Transferido</span>
                </div>
                <p className="font-bold text-slate-900">
                  {transferredBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
              </Card>
            </div>
          </div>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Histórico de Recebimentos</h3>
              <p className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md flex items-center gap-1">
                <Calendar size={12} />
                {months[selectedMonth - 1]} / {selectedYear}
              </p>
            </div>
            <div className="space-y-3">
              {history.length > 0 ? (
                history.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.studentName}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(item.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        + {(item.price * 0.8).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                      <p className="text-[10px] text-slate-400">Líquido (80%)</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-500 text-sm">Nenhum recebimento registrado neste período.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {!stripePayoutsEnabled && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-500" />
          <div>
            <p className="text-sm font-bold text-amber-900 mb-1">Conta de recebimento não configurada</p>
            <p className="text-sm text-amber-700">
              Conecte sua conta bancária para receber os pagamentos das suas aulas.{' '}
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
