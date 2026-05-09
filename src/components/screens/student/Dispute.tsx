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
    <div className="pb-28 md:pb-10 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Disputas</h1>
        <p className="text-slate-500 text-sm">Conteste pagamentos em até 48h após a conclusão da aula</p>
      </header>

      {completedLessons.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Nenhuma aula concluída"
          description="Disputas só podem ser abertas para aulas concluídas."
        />
      ) : (
        <div className="space-y-3">
          {completedLessons.map((lesson) => {
            const eligible = isEligible(lesson);
            const isOpen = !!lesson.disputeOpened;
            const isExpanded = expandedId === lesson.id;
            const reason = reasons[lesson.id] ?? '';

            return (
              <Card key={lesson.id} className={cn(isOpen && "border-amber-200 bg-amber-50")}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-slate-900">
                      {lesson.instructorName ?? 'Instrutor'}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock size={14} />
                      {format(new Date(lesson.date), "dd 'de' MMM, yyyy", { locale: ptBR })} · {lesson.startTime}
                    </p>
                    {lesson.price != null && (
                      <p className="text-sm font-bold text-slate-700 mt-1">
                        R$ {lesson.price.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {isOpen ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                        <AlertTriangle size={12} /> Em disputa
                      </span>
                    ) : eligible ? (
                      <button
                        onClick={() => {
                          setSubmitError(null);
                          setExpandedId(isExpanded ? null : lesson.id);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-full transition-colors"
                      >
                        Contestar {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Prazo expirado</span>
                    )}
                  </div>
                </div>

                {isOpen && lesson.disputeReason && (
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <p className="text-xs font-bold text-amber-700 mb-1">Motivo da contestação</p>
                    <p className="text-xs text-amber-800 italic">&ldquo;{lesson.disputeReason}&rdquo;</p>
                  </div>
                )}

                <AnimatePresence>
                  {isExpanded && !isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                        <label className="block text-sm font-medium text-slate-700">
                          Descreva o motivo da contestação
                        </label>
                        <textarea
                          value={reason}
                          onChange={(e) =>
                            setReasons(prev => ({ ...prev, [lesson.id]: e.target.value }))
                          }
                          rows={3}
                          placeholder="Ex: A aula não ocorreu conforme o esperado..."
                          className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none resize-none"
                        />
                        {submitError && (
                          <p className="text-xs text-red-600">{submitError}</p>
                        )}
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            className="flex-1"
                            onClick={() => setExpandedId(null)}
                            disabled={mutation.isPending}
                          >
                            Cancelar
                          </Button>
                          <Button
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white shadow-red-200"
                            disabled={!reason.trim() || mutation.isPending}
                            onClick={() =>
                              mutation.mutate({ lessonId: lesson.id, reason })
                            }
                          >
                            {mutation.isPending ? (
                              <span className="flex items-center gap-2">
                                <Loader2 size={14} className="animate-spin" /> Enviando...
                              </span>
                            ) : (
                              'Abrir Disputa'
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
