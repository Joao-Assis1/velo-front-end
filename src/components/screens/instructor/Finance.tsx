"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, AlertTriangle, Loader2, ShieldCheck } from 'lucide-react';

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

  const fmtBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const totalMonth = availableBalance + pendingBalance + transferredBalance;

  return (
    <div className="pb-28 md:pb-10">

      {/* Hero strip */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 -mx-4 md:-mx-8 -mt-6 px-4 md:px-8 pt-6 pb-5 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack} aria-label="Voltar" className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Financeiro</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Seus ganhos</h1>
              <p className="text-slate-400 text-xs mt-0.5">Acompanhe seus recebimentos</p>
            </div>
            {/* Month/Year picker */}
            <div className="flex items-center gap-1 bg-white/10 border border-white/15 rounded-xl p-1 self-start sm:self-auto">
              <select
                value={selectedMonth}
                onChange={(e) => onMonthYearChange(Number(e.target.value), selectedYear)}
                className="bg-transparent text-white text-xs font-medium px-2 py-1 focus:outline-none cursor-pointer"
              >
                {months.map((m, i) => (
                  <option key={m} value={i + 1} className="bg-slate-800">{m}</option>
                ))}
              </select>
              <div className="w-px h-3 bg-white/20" />
              <select
                value={selectedYear}
                onChange={(e) => onMonthYearChange(selectedMonth, Number(e.target.value))}
                className="bg-transparent text-white text-xs font-medium px-2 py-1 focus:outline-none cursor-pointer"
              >
                {years.map(y => (
                  <option key={y} value={y} className="bg-slate-800">{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* KPI tiles */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-white/7 border border-white/10 rounded-xl px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Disponível</p>
              <p className="text-lg font-black text-white mt-0.5 tabular-nums truncate">{fmtBRL(availableBalance * 0.8)}</p>
              <p className="text-[9px] text-slate-600">líquido</p>
            </div>
            <div className="bg-white/7 border border-white/10 rounded-xl px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">A receber</p>
              <p className="text-lg font-black text-white mt-0.5 tabular-nums truncate">{fmtBRL(pendingBalance * 0.8)}</p>
              <p className="text-[9px] text-slate-600">em validação</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-blue-600" size={36} />
          <p className="text-slate-500 font-medium text-sm">Carregando dados financeiros...</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-5xl mx-auto">

          {/* Total card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/15 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total do mês · {months[selectedMonth - 1]}</p>
              <p className="text-3xl font-black text-white tabular-nums">{fmtBRL(totalMonth)}</p>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-white/7 border border-white/10 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <ArrowDownLeft size={12} className="text-blue-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Transferido</span>
                  </div>
                  <p className="font-bold text-white text-sm tabular-nums">{fmtBRL(transferredBalance)}</p>
                </div>
                <div className="bg-white/7 border border-white/10 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <ArrowUpRight size={12} className="text-amber-400" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">Taxa (20%)</span>
                  </div>
                  <p className="font-bold text-white text-sm tabular-nums">{fmtBRL(totalMonth * 0.2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stripe status */}
          {stripePayoutsEnabled ? (
            <div className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-700">Conta de recebimento ativa</p>
                <p className="text-xs text-green-600 mt-0.5">Recebimentos via Stripe habilitados</p>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-500" />
              <div>
                <p className="text-sm font-bold text-amber-900 mb-1">Conta de recebimento não configurada</p>
                <p className="text-sm text-amber-700">
                  Conecte sua conta bancária para receber o valor das suas aulas.{' '}
                  <Link href="/app/instructor/settings" className="underline font-semibold">
                    Configurar agora
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Automatic transfers info */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="text-sm font-bold text-blue-900 mb-1">Transferências automáticas</p>
              <p className="text-sm text-blue-700">
                Seu saldo é transferido para sua conta de recebimento após cada aula concluída (taxa da plataforma: 20%).
              </p>
            </div>
          </div>

          {/* History */}
          <section>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              Histórico de Recebimentos
            </p>
            <div className="space-y-2">
              {history.length > 0 ? (
                history.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {item.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.studentName}</p>
                        <p className="text-xs text-slate-500">
                          {item.date?.split(' ')[0]} · Aula prática
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-sm">
                        +{fmtBRL(item.price * 0.8)}
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
        </div>
      )}
    </div>
  );
};
