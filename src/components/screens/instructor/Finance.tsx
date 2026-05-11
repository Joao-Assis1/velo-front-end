"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CreditCard, TrendingUp, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import { Card, Button } from '@/components/ui-custom';
import { ScheduledClass } from '@/types';

export const InstructorFinance = ({
  classes,
  onBack
}: {
  classes: ScheduledClass[],
  onBack: () => void
}) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawRequested, setWithdrawRequested] = useState(false);

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
              <span>Saques</span>
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

      <button
        onClick={() => !withdrawRequested && setShowWithdrawModal(true)}
        disabled={totalEarnings === 0 || withdrawRequested}
        className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold shadow-lg active:scale-[0.98] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {withdrawRequested ? 'Solicitação Registrada' : 'Solicitar Saque'}
      </button>

      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowWithdrawModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl text-center"
            >
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Confirmar Saque</h3>
              <p className="text-sm text-slate-500 mb-2">
                Você deseja solicitar o saque de
              </p>
              <p className="text-2xl font-bold text-slate-900 mb-5">
                {totalEarnings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setShowWithdrawModal(false)}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                  onClick={() => { setShowWithdrawModal(false); setWithdrawRequested(true); }}
                >
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
