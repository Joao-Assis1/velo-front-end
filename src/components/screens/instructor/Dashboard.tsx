"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, CheckCircle2, AlertCircle, Calendar, History } from 'lucide-react';
import { isToday, format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-custom';
import { ScheduledClass, Instructor } from '@/types';
import { useApp } from '@/context/AppContext';
import { EmptyState } from '@/components/ui-custom/EmptyState';

export const InstructorDashboard = ({
  profile,
  onViewSchedule,
  classes,
  onGiveFeedback,
  onRegularize,
  onRenew,
}: {
  profile: Instructor | null;
  onViewSchedule: () => void;
  classes: ScheduledClass[];
  onGiveFeedback: (id: string, feedback: string) => void;
  onRegularize: () => void;
  onRenew: () => void;
  availableBalance?: number;
  monthlyEarnings?: number;
}) => {
  const myClasses = classes.filter((c) => c.instructorId === profile?.id);
  const todayClasses = myClasses.filter((c) => isToday(c.date));
  const pendingClasses = myClasses.filter((c) => c.status === 'pending_acceptance');
  const completedClasses = myClasses
    .filter((c) => c.status === 'completed')
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const now = new Date();

  const [feedbackClassId, setFeedbackClassId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleFeedbackSubmit = () => {
    if (feedbackClassId && feedbackText) {
      onGiveFeedback(feedbackClassId, feedbackText);
      setFeedbackClassId(null);
      setFeedbackText('');
    }
  };

  const daysToExpiry = profile?.cnhExpiry
    ? differenceInDays(new Date(profile.cnhExpiry), new Date())
    : null;
  const isExpiring = daysToExpiry !== null && daysToExpiry > 0 && daysToExpiry <= 30;
  const isExpired = daysToExpiry !== null && daysToExpiry <= 0;
  const isInactive = profile?.isActive === false || isExpired;

  const firstName = profile?.name?.split(' ')[0] || 'Instrutor';
  const todayLabel = format(now, "EEEE, dd 'de' MMMM", { locale: ptBR });

  const fmtBRL = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="pb-28 md:pb-10">

      {/* Hero strip */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 -mx-4 md:-mx-8 -mt-6 px-4 md:px-8 pt-6 pb-5 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-56 h-56 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/6 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 capitalize">
            {todayLabel}
          </p>
          <div className="mt-1">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Olá, {firstName}
            </h1>
          </div>

          {/* KPI tiles */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/7 border border-white/10 rounded-xl px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Hoje</p>
              <p className="text-xl font-black text-white mt-0.5">{todayClasses.length}</p>
              <p className="text-[9px] text-slate-600 mt-0.5">aulas</p>
            </div>
            <div className="bg-white/7 border border-white/10 rounded-xl px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Saldo</p>
              <p className="text-sm font-black text-white mt-0.5 tabular-nums truncate">{fmtBRL(availableBalance)}</p>
              <p className="text-[9px] text-slate-600 mt-0.5">disponível</p>
            </div>
            <div className="bg-white/7 border border-white/10 rounded-xl px-3 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Mês</p>
              <p className="text-sm font-black text-white mt-0.5 tabular-nums truncate">{fmtBRL(monthlyEarnings)}</p>
              <p className="text-[9px] text-slate-600 mt-0.5">ganhos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Alerts */}
        {isInactive && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 items-center">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0">
              <AlertCircle size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-red-900">Conta Inativa / Credencial Vencida</h4>
              <p className="text-xs text-red-700 mt-0.5">Seu perfil está oculto no marketplace. Regularize para receber alunos.</p>
            </div>
            <Button size="sm" variant="primary" className="bg-red-600 hover:bg-red-700 shrink-0" onClick={onRegularize}>
              Regularizar
            </Button>
          </div>
        )}

        {!isInactive && isExpiring && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-center">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-amber-900">Credencial Vencendo</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Sua credencial do DETRAN vence em {daysToExpiry} dias. Renove para evitar bloqueios.
              </p>
            </div>
            <Button size="sm" variant="primary" className="bg-amber-500 hover:bg-amber-600 shrink-0 text-white" onClick={onRenew}>
              Renovar
            </Button>
          </div>
        )}

        {/* Pending requests */}
        {pendingClasses.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Aguardando resposta</p>
              <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{pendingClasses.length}</span>
            </div>
            <div className="space-y-2">
              {pendingClasses.map((cls) => (
                <div key={cls.id} className="bg-white border border-amber-200 border-l-[3px] border-l-amber-500 rounded-2xl p-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(cls.studentName || 'A').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{cls.studentName || 'Aluno'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {format(cls.date, "dd/MM", { locale: ptBR })} · {cls.startTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Desktop 2-col: Today's schedule + Completed */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

          {/* Today's schedule */}
          <section className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Agenda de hoje</p>
                <p className="text-xs text-slate-500">
                  {todayClasses.length} aula{todayClasses.length !== 1 ? 's' : ''} agendada{todayClasses.length !== 1 ? 's' : ''}
                </p>
              </div>
              {todayClasses.length > 0 && (
                <button
                  onClick={onViewSchedule}
                  className="text-blue-600 text-xs font-semibold hover:underline underline-offset-2"
                >
                  Ver agenda →
                </button>
              )}
            </div>

            <div className="space-y-2">
              {todayClasses.length > 0 ? (
                todayClasses.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 items-center"
                  >
                    <div className="w-14 text-center shrink-0">
                      <div className="bg-blue-50 rounded-lg px-1 py-1.5">
                        <p className="font-black text-blue-600 text-xs tabular-nums">{item.startTime}</p>
                      </div>
                    </div>
                    <div className={cn(
                      'flex-1 flex justify-between items-center p-3 rounded-xl',
                      item.status === 'completed' ? 'bg-slate-50 opacity-60' :
                      item.status === 'in-progress' ? 'bg-green-50' : 'bg-slate-50'
                    )}>
                      <div className="flex items-center gap-2.5">
                        <div className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          item.status === 'completed' ? "bg-green-500" :
                          item.status === 'in-progress' ? "bg-green-600" : "bg-blue-600"
                        )} />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{item.studentName || 'Aluno'}</p>
                          <p className={cn(
                            'text-xs font-medium mt-0.5',
                            item.status === 'in-progress' ? 'text-green-600' : 'text-slate-400'
                          )}>
                            {item.status === 'in-progress' ? 'Em andamento' : 'Aula Prática'}
                          </p>
                        </div>
                      </div>
                      {item.status === 'completed' ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <button
                          disabled
                          title="Chat disponível em breve"
                          aria-label="Enviar mensagem"
                          className="w-7 h-7 rounded-lg bg-slate-100 text-slate-300 flex items-center justify-center cursor-not-allowed"
                        >
                          <MessageCircle size={13} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="Sem aulas para hoje"
                  description="Sua agenda está livre. Aproveite para organizar seus horários."
                  className="py-8 rounded-xl border border-dashed border-slate-200"
                />
              )}
            </div>
          </section>

          {/* Completed classes / feedback */}
          <section className="lg:col-span-2">
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Aulas concluídas</p>
              <p className="text-xs text-slate-500">Feedback pendente ou enviado</p>
            </div>

            {completedClasses.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {completedClasses.slice(0, 6).map((cls) => (
                  <div key={cls.id} className="py-3.5 first:pt-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{cls.studentName || 'Aluno'}</p>
                        <p className="text-xs text-slate-400 mt-0.5 tabular-nums">
                          {format(cls.date, 'dd/MM/yyyy', { locale: ptBR })} · {cls.startTime}
                        </p>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-50 text-green-700 shrink-0">
                        Concluída
                      </span>
                    </div>

                    {cls.instructorFeedback ? (
                      <div className="bg-slate-50 px-3 py-2 rounded-lg">
                        <p className="text-[10px] font-black text-blue-600 mb-1 flex items-center gap-1">
                          <CheckCircle2 size={10} aria-hidden="true" /> Feedback enviado
                        </p>
                        <p className="text-xs text-slate-500 italic leading-relaxed">
                          "{cls.instructorFeedback}"
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setFeedbackClassId(cls.id)}
                        className="w-full py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-blue-100 hover:border-blue-600/30"
                      >
                        <MessageCircle size={12} aria-hidden="true" /> Dar Feedback
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={History}
                title="Nenhum histórico"
                description="Suas aulas concluídas aparecerão aqui."
                className="py-10"
              />
            )}
          </section>
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackClassId && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setFeedbackClassId(null)}
            />
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-6 w-full max-w-md relative z-10"
            >
              <h3 className="text-lg font-black text-slate-900 mb-1">Feedback ao Aluno</h3>
              <p className="text-sm text-slate-500 mb-5">Como foi o desempenho durante a aula?</p>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none resize-none text-sm bg-slate-50 mb-5"
                rows={4}
                placeholder="Descreva o desempenho do aluno..."
                autoFocus
              />

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setFeedbackClassId(null)}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-none"
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackText.trim()}
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
