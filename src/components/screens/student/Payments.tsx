"use client";

import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Plus, Clock, Trash2, Edit2, X, Check, Loader2, AlertCircle } from 'lucide-react';
import { Card, Button } from '@/components/ui-custom';
import { 
  getStudentPaymentMethodsAction, 
  deletePaymentMethodAction 
} from '@/lib/actions/payment-methods';
import { getStudentPaymentsAction } from '@/lib/actions/payments';
import { useApp } from '@/context/AppContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddCardForm } from '@/components/features/AddCardForm';
import { motion, AnimatePresence } from 'motion/react';

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
    enabled: !!studentProfile?.id
  });

  const deleteCardMutation = useMutation({
    mutationFn: (id: string) => deletePaymentMethodAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    }
  });


  return (
    <div className="pb-28 md:pb-10 space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pagamentos</h1>
          <p className="text-slate-500 text-sm">Gerencie seus métodos de pagamento</p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div 
            key="add-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
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
            className="space-y-6"
          >
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900">Meus Cartões</h3>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="text-velo-blue font-bold text-sm flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Plus size={16} /> Adicionar
                </button>
              </div>
              
              <div className="space-y-4">
                {loadingCards ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-velo-blue" />
                  </div>
                ) : cards.length > 0 ? (
                  cards.map((card: any) => (
                    <div key={card.id} className="relative group">
                      <Card className="bg-slate-900 text-white border-none p-6 relative overflow-hidden shadow-xl">
                        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="flex justify-between items-start mb-8">
                          <CreditCard size={32} className="text-white/80" />
                          {deletingCardId === card.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                aria-label="Confirmar exclusão"
                                onClick={() => { deleteCardMutation.mutate(card.id); setDeletingCardId(null); }}
                                className="p-2 rounded-full transition-colors text-red-400 hover:text-red-600"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                type="button"
                                aria-label="Cancelar"
                                onClick={() => setDeletingCardId(null)}
                                className="p-2 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              aria-label="Excluir cartão"
                              onClick={() => setDeletingCardId(card.id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/40 rounded-full transition-colors text-red-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                        <p className="text-xl font-medium tracking-widest mb-6">•••• •••• •••• {card.last4}</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Titular</p>
                            <p className="text-sm font-bold truncate max-w-[150px]">{card.cardholderName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Validade</p>
                            <p className="text-sm font-bold">{card.expiryMonth}/{card.expiryYear.toString().slice(-2)}</p>
                          </div>
                        </div>
                        {card.isDefault && (
                          <div className="absolute top-4 right-14 bg-green-500/20 text-green-300 text-[10px] font-bold px-2 py-1 rounded-full border border-green-500/30">
                            PADRÃO
                          </div>
                        )}
                      </Card>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-500 text-sm">Nenhum cartão cadastrado.</p>
                  </div>
                )}
              </div>
            </section>

            <section>
              <h3 className="font-bold text-slate-900 mb-4">Atividade Recente</h3>
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                {loadingHistory ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-slate-300" />
                  </div>
                ) : history.length > 0 ? (
                  history.map((payment: any) => (
                    <div key={payment.id} className="p-4 border-b last:border-0 border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payment.status === 'PAID' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Aula {payment.lesson?.instructor?.name ? `com ${payment.lesson.instructor.name}` : ''}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(payment.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">R$ {payment.amount.toFixed(2)}</p>
                        <p className={`text-[10px] font-bold ${
                          payment.status === 'PAID' ? 'text-green-500' : 'text-orange-500'
                        }`}>{payment.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-slate-400 text-sm italic">Nenhuma transação encontrada.</p>
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
