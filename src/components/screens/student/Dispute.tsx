"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, AlertTriangle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMutation } from '@tanstack/react-query';
import { Card, Button } from '@/components/ui-custom';
import { useApp } from '@/context/AppContext';
import { openDisputeAction } from '@/lib/actions/disputes';
import { ScheduledClass } from '@/types';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/ui-custom/EmptyState';

const DISPUTE_WINDOW_MS = 48 * 60 * 60 * 1000;

function isEligible(lesson: ScheduledClass): boolean {
  if (lesson.status !== 'completed') return false;
  if (lesson.disputeOpened) return false;
  if (!lesson.checkOutTime) return false;
  return Date.now() - new Date(lesson.checkOutTime).getTime() <= DISPUTE_WINDOW_MS;
}

export const StudentDispute = () => {
  const { scheduledClasses, setScheduledClasses } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const completedLessons = scheduledClasses
    .filter(c => c.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const mutation = useMutation({
    mutationFn: ({ lessonId, reason }: { lessonId: string; reason: string }) =>
      openDisputeAction(lessonId, reason),
    onSuccess: (res, { lessonId }) => {
      if (!res.success) {
        setSubmitError(res.error ?? 'Erro ao abrir disputa');
        return;
      }
      setSubmitError(null);
      setExpandedId(null);
      setScheduledClasses(
        scheduledClasses.map(c =>
          c.id === lessonId
            ? { ...c, disputeOpened: true, disputeReason: reasons[lessonId] }
            : c
        )
      );
    },
    onError: (err: Error) => setSubmitError(err.message ?? 'Erro ao abrir disputa'),
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark header com accent vermelho */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-2xl mx-auto w-full px-4 md:px-6 pt-6 pb-6 relative z-10">
          <p className="text-xs font-bold tracking-widest uppercase text-red-400">Central de disputas</p>
          <h1 className="text-xl font-extrabold text-slate-50 mt-0.5">Contestar Aula</h1>
          <p className="text-xs text-slate-400 mt-0.5">Prazo: até 48h após a conclusão</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 pb-28 md:pb-12 pt-6 space-y-4">
        {submitError && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-semibold p-3 rounded-xl">
            {submitError}
          </div>
        )}

        {completedLessons.length === 0 ? (
          <EmptyState
            icon={AlertTriangle}
            title="Nenhuma aula concluída"
            description="As aulas concluídas que são qualificáveis para disputa aparecerão aqui."
          />
        ) : (
          completedLessons.map((lesson) => {
            const eligible = isEligible(lesson);
            const isOpen = !!lesson.disputeOpened;
            const isExpanded = expandedId === lesson.id;
            const reason = reasons[lesson.id] ?? '';

            return (
              <div
                key={lesson.id}
                className={cn(
                  "bg-white rounded-2xl shadow-sm border transition-all overflow-hidden",
                  isOpen
                    ? "border-amber-200 bg-amber-50/30"
                    : eligible
                    ? "border-slate-100 border-l-[3px] border-l-red-500 hover:shadow-md"
                    : "border-slate-100 opacity-60"
                )}
              >
                <div className="p-4 flex items-center justify-between text-left">
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm">
                      {lesson.instructorName ?? 'Instrutor'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      {format(new Date(lesson.date), "dd 'de' MMMM · HH:mm", { locale: ptBR })}
                    </p>
                    {lesson.price != null && (
                      <p className="text-xs font-bold text-slate-600 mt-1">
                        R$ {lesson.price.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isOpen ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full">
                        <AlertTriangle size={12} /> Em disputa
                      </span>
                    ) : eligible ? (
                      <button
                        onClick={() => {
                          setSubmitError(null);
                          setExpandedId(isExpanded ? null : lesson.id);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                      >
                        Contestar {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">Prazo expirado</span>
                    )}
                  </div>
                </div>

                {isOpen && lesson.disputeReason && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="h-px bg-amber-100 mb-3" />
                    <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100">
                      <p className="text-xs font-bold text-amber-800 mb-1">Motivo da contestação</p>
                      <p className="text-xs text-amber-900 italic font-medium">&ldquo;{lesson.disputeReason}&rdquo;</p>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {isExpanded && !isOpen && eligible && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 space-y-3">
                        <div className="h-px bg-slate-100" />
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                            Motivo da contestação
                          </label>
                          <textarea
                            value={reason}
                            onChange={(e) =>
                              setReasons(prev => ({ ...prev, [lesson.id]: e.target.value }))
                            }
                            placeholder="Descreva o problema com detalhes..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition resize-none"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setExpandedId(null)}
                            disabled={mutation.isPending}
                            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => mutation.mutate({ lessonId: lesson.id, reason })}
                            disabled={!reason.trim() || mutation.isPending}
                            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl text-sm transition-colors cursor-pointer disabled:opacity-40 active:scale-[0.98] flex items-center justify-center gap-1.5"
                          >
                            {mutation.isPending ? "Enviando..." : "Enviar contestação"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
