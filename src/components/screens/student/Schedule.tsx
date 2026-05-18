"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Star, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-custom';
import { ScheduledClass } from '@/types';
import { EmptyState } from '@/components/ui-custom/EmptyState';

export const StudentSchedule = ({
  classes,
  onCancelClass,
  onRateClass
}: {
  classes: ScheduledClass[],
  onCancelClass: (id: string) => Promise<void>,
  onRateClass: (id: string, rating: number, text: string) => void
}) => {
  const [classToCancel, setClassToCancel] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [classToRate, setClassToRate] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const upcomingClasses = classes
    .filter(c => c.status === 'pending_acceptance' || c.status === 'upcoming' || c.status === 'in-progress')
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const pastClasses = classes
    .filter(c => c.status === 'completed' || c.status === 'cancelled')
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleRateSubmit = () => {
    if (classToRate && rating > 0) {
      onRateClass(classToRate, rating, feedbackText);
      setClassToRate(null);
      setRating(0);
      setFeedbackText('');
    }
  };

  return (
    <div className="pb-28 md:pb-10">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Minhas Aulas</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          {upcomingClasses.length > 0
            ? `${upcomingClasses.length} agendada${upcomingClasses.length !== 1 ? 's' : ''}`
            : 'Gerencie seus agendamentos'}
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Próximas</h2>
        {upcomingClasses.length > 0 ? (
          <div className="space-y-2">
            {upcomingClasses.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-4 items-center bg-white rounded-2xl p-4 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="shrink-0 w-11 text-center">
                  <div className={cn(
                    "text-2xl font-black leading-none tabular-nums",
                    cls.status === 'in-progress'
                      ? "text-orange-500"
                      : cls.status === 'pending_acceptance'
                        ? "text-amber-500"
                        : "text-velo-blue"
                  )}>
                    {format(cls.date, "dd")}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                    {format(cls.date, "MMM", { locale: ptBR })}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm leading-tight truncate">{cls.instructorName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{cls.startTime}</p>
                  {cls.payment?.status && cls.payment.status !== 'COMPLETED' && (
                    <p className={cn(
                      "text-[10px] font-bold mt-0.5",
                      cls.payment.status === 'PENDING' ? "text-amber-500" :
                      cls.payment.status === 'OVERDUE' ? "text-red-500" :
                      cls.payment.status === 'REFUNDED' ? "text-blue-500" : "text-slate-400"
                    )}>
                      {cls.payment.status === 'PENDING' ? 'Pagamento pendente' :
                       cls.payment.status === 'OVERDUE' ? 'Pagamento vencido' :
                       cls.payment.status === 'REFUNDED' ? 'Reembolsado' : ''}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide",
                    cls.status === 'pending_acceptance'
                      ? "bg-amber-100 text-amber-600"
                      : cls.status === 'in-progress'
                        ? "bg-orange-100 text-orange-600"
                        : "bg-blue-50 text-velo-blue"
                  )}>
                    {cls.status === 'pending_acceptance'
                      ? 'Aguardando'
                      : cls.status === 'in-progress'
                        ? 'Em andamento'
                        : 'Agendada'}
                  </span>
                  {(cls.status === 'upcoming' || cls.status === 'pending_acceptance') && (
                    <button
                      onClick={() => setClassToCancel(cls.id)}
                      className="text-[10px] text-red-400 font-bold hover:text-red-600 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="Nenhuma aula agendada"
            description="Vá ao marketplace e escolha um instrutor para sua próxima aula."
          />
        )}
      </section>

      <section>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Histórico</h2>
        {pastClasses.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {pastClasses.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="py-4 first:pt-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 items-start">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-1.5 shrink-0",
                      cls.status === 'completed' ? "bg-velo-green" : "bg-red-400"
                    )} />
                    <div>
                      <p className="font-bold text-slate-900 text-sm leading-tight">{cls.instructorName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {format(cls.date, "dd/MM/yyyy", { locale: ptBR })} · {cls.startTime}
                      </p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black px-2 py-0.5 rounded-full uppercase shrink-0",
                    cls.status === 'completed'
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  )}>
                    {cls.status === 'completed' ? 'Concluída' : 'Cancelada'}
                  </span>
                </div>

                {cls.status === 'completed' && (
                  <div className="ml-5 mt-3 space-y-2">
                    {cls.studentFeedbackRating !== undefined ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              size={11}
                              className={j < cls.studentFeedbackRating! ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}
                            />
                          ))}
                        </div>
                        {cls.studentFeedbackText && (
                          <p className="text-xs text-slate-400 italic truncate">"{cls.studentFeedbackText}"</p>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setClassToRate(cls.id)}
                        className="text-xs font-bold text-velo-blue hover:text-velo-blue-dark flex items-center gap-1.5 transition-colors"
                      >
                        <Star size={12} /> Avaliar aula
                      </button>
                    )}

                    {cls.instructorFeedback && (
                      <div className="bg-blue-50/60 px-3 py-2 rounded-lg">
                        <p className="text-[10px] font-black text-velo-blue uppercase tracking-wider mb-1">Instrutor</p>
                        <p className="text-xs text-slate-600">"{cls.instructorFeedback}"</p>
                      </div>
                    )}

                    {!cls.disputeOpened && cls.checkOutTime &&
                      (Date.now() - new Date(cls.checkOutTime).getTime() <= 48 * 60 * 60 * 1000) && (
                      <Link
                        href="/app/student/dispute"
                        className="text-xs text-red-400 font-bold hover:text-red-600 flex items-center gap-1 transition-colors w-fit"
                      >
                        <AlertTriangle size={11} /> Contestar pagamento
                      </Link>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-8">Nenhum histórico disponível.</p>
        )}
      </section>

      <AnimatePresence>
        {classToCancel && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setClassToCancel(null)}
            />
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10"
            >
              <h3 className="text-lg font-black text-slate-900 mb-1">Cancelar aula?</h3>
              <p className="text-slate-500 text-sm mb-5">Esta ação não pode ser desfeita.</p>

              {cancelError && (
                <div className="mb-4 px-4 py-3 bg-red-50 rounded-xl text-sm text-red-600">
                  {cancelError}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => { setClassToCancel(null); setCancelError(null); }}>
                  Manter
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  disabled={isCancelling}
                  onClick={async () => {
                    if (!classToCancel) return;
                    setIsCancelling(true);
                    setCancelError(null);
                    try {
                      await onCancelClass(classToCancel);
                      setClassToCancel(null);
                    } catch (err: any) {
                      setCancelError(err.message || 'Não foi possível cancelar');
                    } finally {
                      setIsCancelling(false);
                    }
                  }}
                >
                  {isCancelling ? 'Cancelando...' : 'Sim, cancelar'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {classToRate && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setClassToRate(null)}
            />
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10"
            >
              <h3 className="text-lg font-black text-slate-900 mb-1">Avaliar aula</h3>
              <p className="text-slate-500 text-sm mb-5">Como foi esta experiência?</p>

              <div className="flex justify-center gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      size={32}
                      className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-100"}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-velo-blue/20 focus:border-velo-blue/40 outline-none resize-none text-sm bg-slate-50 mb-5"
                rows={3}
                placeholder="Comentário opcional..."
              />

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setClassToRate(null)}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-velo-blue text-white"
                  onClick={handleRateSubmit}
                  disabled={rating === 0}
                >
                  Enviar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
