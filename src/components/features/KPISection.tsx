"use client";

import React from 'react';
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '@/components/ui-custom';
import { cn } from '@/lib/utils';

interface KPIProps {
  availableBalance: number;
  pendingBalance: number;
  monthlyEarnings: number;
  growth: number;
}

export const KPISection = ({ availableBalance, pendingBalance, monthlyEarnings, growth }: KPIProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Available Balance */}
      <Card className="bg-velo-blue text-white border-none p-6 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
              <DollarSign size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Disponível</span>
          </div>
          <p className="text-3xl font-black tracking-tight">R$ {availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-blue-100/70 mt-1 font-medium">Pronto para saque</p>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
      </Card>

      {/* Pending Balance */}
      <Card className="bg-white border-slate-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <TrendingUp size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-1 rounded">A Liberar</span>
        </div>
        <p className="text-3xl font-black tracking-tight text-slate-900">R$ {pendingBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        <p className="text-xs text-slate-400 mt-1 font-medium">Aulas em validação</p>
      </Card>

      {/* Monthly Earnings */}
      <Card className="bg-white border-slate-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-velo-green/10 rounded-lg text-velo-green">
            <TrendingUp size={24} />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded",
            growth >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(growth)}%
          </div>
        </div>
        <p className="text-3xl font-black tracking-tight text-slate-900">R$ {monthlyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        <p className="text-xs text-slate-400 mt-1 font-medium">Ganhos em Maio</p>
      </Card>
    </div>
  );
};
