"use client";

import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Plus, Trash2, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui-custom';
import {
  getStudentPaymentMethodsAction,
  deletePaymentMethodAction
} from '@/lib/actions/payment-methods';
import { getStudentPaymentsAction } from '@/lib/actions/payments';
import { useApp } from '@/context/AppContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddCardForm } from '@/components/features/AddCardForm';
import { motion, AnimatePresence } from 'motion/react';

const statusConfig = (s: string) => {
  switch (s) {
    case 'COMPLETED': return { label: 'Pago', color: 'text-green-600' };
    case 'PAID': return { label: 'Pago', color: 'text-green-600' };
    case 'PENDING': return { label: 'Aguardando confirmação', color: 'text-amber-500' };
    case 'OVERDUE': return { label: 'Vencido', color: 'text-red-500' };
    case 'REFUNDED': return { label: 'Reembolsado', color: 'text-blue-500' };
    default: return { label: s, color: 'text-slate-400' };
  }
};

export const StudentPayments = ({
  onBack
}: {
  onBack: () => void
}) => {
  const { studentProfile } = useApp();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  const { data: cards = [], isLoading: loadingCards } = useQuery({
    queryKey: ['payment-methods', studentProfile?.id],
    queryFn: async () => {
      if (!studentProfile?.id) return [];
      const res = await getStudentPaymentMethodsAction(studentProfile.id);
      return res.success ? res.data : [];
    },
    enabled: !!studentProfile?.id
  });

  const { data: history = [], isLoading: loadingHistory } = useQuery({
    queryKey: ['payments', studentProfile?.id],
    queryFn: async () => {
      if (!studentProfile?.id) return [];
      const res = await getStudentPaymentsAction(studentProfile.id);
      return res.success ? res.data : [];
    },
    enabled: !!studentProfile?.id,
    refetchInterval: (query) => {
      const data = query.state.data as any[] | undefined;
      return data?.some((p) => p.status === 'PENDING') ? 5000 : false;
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (id: string) => deletePaymentMethodAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    }
  });

  return (
    <div className="pb-28 md:pb-10">
      <header className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pagamentos</h1>
          <p className="text-slate-400 text-sm">Cartões e histórico de transações</p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            key="add-card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <AddCardForm
              onClose={() => setIsAdding(false)}
              onSuccess={() => {
                setIsAdding(false);
                queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="card-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Meus Cartões</h2>
                <button
                  onClick={() => setIsAdding(true)}
                  className="text-velo-blue font-bold text-sm flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Plus size={14} /> Adicionar
                </button>
              </div>

              {loadingCards ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-slate-300" size={24} />
                </div>
              ) : cards.length > 0 ? (
                <div className="space-y-3">
                  {cards.map((card: any) => (
                    <div key={card.id} className="relative">
                      <div className="bg-slate-900 text-white rounded-2xl p-6 overflow-hidden">
                        <div className="flex justify-between items-start mb-8">
                          <CreditCard size={28} className="text-white/60" />
                          {deletingCardId === card.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                aria-label="Confirmar exclusão"
                                onClick={() => { deleteCardMutation.mutate(card.id); setDeletingCardId(null); }}
                                className="p-2 rounded-full transition-colors text-red-400 hover:text-red-300"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                type="button"
                                aria-label="Cancelar"
                                onClick={() => setDeletingCardId(null)}
                                className="p-2 rounded-full transition-colors text-white/40 hover:text-white/70"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              aria-label="Excluir cartão"
                              onClick={() => setDeletingCardId(card.id)}
                              className="p-2 bg-white/10 hover:bg-red-500/30 rounded-full transition-colors text-white/50 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                        <p className="text-lg font-medium tracking-[0.2em] mb-5 text-white/90">
                          •••• •••• •••• {card.last4}
                        </p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Titular</p>
                            <p className="text-sm font-bold truncate max-w-[160px]">{card.cardholderName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Validade</p>
                            <p className="text-sm font-bold tabular-nums">{card.expiryMonth}/{card.expiryYear.toString().slice(-2)}</p>
                          </div>
                        </div>
                        {card.isDefault && (
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-velo-green/20 text-green-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-green-500/20 uppercase tracking-widest whitespace-nowrap">
                            Padrão
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full py-10 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-velo-blue/30 hover:text-velo-blue transition-colors flex flex-col items-center gap-2"
                >
                  <Plus size={20} />
                  <span className="text-sm font-bold">Adicionar cartão</span>
                </button>
              )}
            </section>

            <section>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Atividade Recente</h2>

              {loadingHistory ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-slate-300" size={24} />
                </div>
              ) : history.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {history.map((payment: any, i: number) => {
                    const cfg = statusConfig(payment.status);
                    return (
                      <motion.div
                        key={payment.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="py-4 first:pt-0 flex items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {payment.lesson?.instructor?.name
                              ? `Aula com ${payment.lesson.instructor.name}`
                              : 'Aula prática'}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-black text-slate-900 tabular-nums">
                            R$ {payment.amount.toFixed(2)}
                          </p>
                          <p className={`text-[10px] font-black uppercase tracking-wide mt-0.5 ${cfg.color}`}>
                            {cfg.label}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-slate-400 text-sm">Nenhuma transação ainda.</p>
                </div>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
