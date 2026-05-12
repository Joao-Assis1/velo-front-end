"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface KPIProps {
  availableBalance: number;
  pendingBalance: number;
  monthlyEarnings: number;
  growth: number;
}

export const KPISection = ({ availableBalance, pendingBalance, monthlyEarnings, growth }: KPIProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-velo-blue text-white rounded-2xl p-5">
        <p className="text-xs font-black uppercase tracking-widest text-blue-200 mb-2">Disponível</p>
        <p className="text-2xl font-black tracking-tight tabular-nums">
          R$ {availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-blue-200/60 mt-1.5 font-medium">Pronto para saque</p>
      </div>

      <div className="bg-amber-50 rounded-2xl p-5">
        <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-2">A Liberar</p>
        <p className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
          R$ {pendingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-amber-700/50 mt-1.5 font-medium">Em validação</p>
      </div>

      <div className="bg-slate-50 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Este Mês</p>
          <span className={cn(
            "text-[10px] font-black px-1.5 py-0.5 rounded-full",
            growth >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {growth >= 0 ? '↑' : '↓'}{Math.abs(growth)}%
          </span>
        </div>
        <p className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">
          R$ {monthlyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-slate-400 mt-1.5 font-medium">Ganhos acumulados</p>
      </div>
    </div>
  );
};
