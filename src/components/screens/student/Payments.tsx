"use client";

import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Plus, Trash2, X, Check, Loader2, Calendar } from 'lucide-react';
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
    case 'COMPLETED':
    case 'PAID':
      return { label: 'Pago', bg: 'bg-green-50', text: 'text-green-600' };
    case 'PENDING':
      return { label: 'Pendente', bg: 'bg-amber-50', text: 'text-amber-600' };
    case 'OVERDUE':
      return { label: 'Vencido', bg: 'bg-red-50', text: 'text-red-600' };
    case 'REFUNDED':
      return { label: 'Reembolsado', bg: 'bg-blue-50', text: 'text-blue-600' };
    default:
      return { label: s, bg: 'bg-slate-50', text: 'text-slate-500' };
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
    <div className="min-h-screen bg-slate-50">
      {/* Dark Header com botão de voltar premium integrado */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 pt-6 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors shrink-0 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-green-400">Financeiro</p>
            <h1 className="text-xl font-extrabold text-slate-50 mt-0.5">Pagamentos</h1>
          </div>
        </div>
      </div>

      <div className="px-4 pb-28 md:pb-10 pt-4">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="add-card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <p className="font-extrabold text-slate-900 text-sm">Adicionar Cartão</p>
                <button
                  onClick={() => setIsAdding(false)}
                  className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
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
              className="space-y-6"
            >
              {/* Meus Cartões */}
              <section>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Meus Cartões</h2>
                  <button
                    onClick={() => setIsAdding(true)}
                    className="text-blue-600 font-extrabold text-xs flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus size={12} /> Adicionar Novo
                  </button>
                </div>

                {loadingCards ? (
                  <div className="bg-slate-800 rounded-2xl h-44 animate-pulse flex items-center justify-center text-white/20">
                    <Loader2 className="animate-spin text-slate-500" size={24} />
                  </div>
                ) : cards.length > 0 ? (
                  <div className="space-y-3">
                    {cards.map((card: any) => (
                      <div
                        key={card.id}
                        className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-5 text-white relative overflow-hidden shadow-md"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/3 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-2">
                            <CreditCard size={24} className="text-blue-400" />
                            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                              {card.brand || 'Cartão'}
                            </span>
                          </div>

                          {deletingCardId === card.id ? (
                            <div className="flex items-center gap-1 bg-white/10 rounded-lg px-1 py-0.5">
                              <button
                                type="button"
                                aria-label="Confirmar exclusão"
                                onClick={() => { deleteCardMutation.mutate(card.id); setDeletingCardId(null); }}
                                className="p-1.5 transition-colors text-red-400 hover:text-red-300 cursor-pointer"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                type="button"
                                aria-label="Cancelar"
                                onClick={() => setDeletingCardId(null)}
                                className="p-1.5 transition-colors text-white/50 hover:text-white/80 cursor-pointer"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              aria-label="Excluir cartão"
                              onClick={() => setDeletingCardId(card.id)}
                              className="w-7 h-7 bg-white/10 hover:bg-red-500/30 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>

                        <p className="text-lg font-bold tracking-[0.2em] mb-5 text-white/95 tabular-nums">
                          •••• •••• •••• {card.last4}
                        </p>

                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Titular</p>
                            <p className="text-xs font-bold uppercase truncate max-w-[170px]">{card.cardholderName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Validade</p>
                            <p className="text-xs font-bold tabular-nums">
                              {card.expiryMonth}/{card.expiryYear.toString().slice(-2)}
                            </p>
                          </div>
                        </div>

                        {card.isDefault && (
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500/20 text-green-300 text-[9px] font-black px-2.5 py-0.5 rounded-full border border-green-500/30 uppercase tracking-widest whitespace-nowrap">
                            Padrão
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-8 rounded-2xl border border-dashed border-slate-300 text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-slate-50 transition-colors flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <Plus size={20} />
                    <span className="text-xs font-extrabold">Nenhum cartão cadastrado. Clique para adicionar.</span>
                  </button>
                )}
              </section>

              {/* Atividade Recente */}
              <section>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Atividade Recente</h2>

                {loadingHistory ? (
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 h-16 animate-pulse" />
                    ))}
                  </div>
                ) : history.length > 0 ? (
                  <div className="space-y-2">
                    {history.map((payment: any, i: number) => {
                      const cfg = statusConfig(payment.status);
                      return (
                        <motion.div
                          key={payment.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-all"
                        >
                          <div>
                            <p className="text-sm font-extrabold text-slate-900 leading-tight">
                              {payment.lesson?.instructor?.name
                                ? `Aula com ${payment.lesson.instructor.name}`
                                : 'Aula prática'}
                            </p>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                              <Calendar size={11} />
                              {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          
                          <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                            <p className="font-extrabold text-slate-950 text-sm tabular-nums">
                              R$ {payment.amount.toFixed(2)}
                            </p>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                              {cfg.label}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400">
                    <p className="text-xs font-semibold">Nenhuma transação financeira encontrada.</p>
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
