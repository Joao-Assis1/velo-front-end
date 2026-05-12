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
import { KPISection } from '@/components/features/KPISection';

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
}) => {
  const { availableBalance, pendingBalance } = useApp();

  const myClasses = classes.filter((c) => c.instructorId === profile?.id);
  const todayClasses = myClasses.filter((c) => isToday(c.date));
  const completedClasses = myClasses
    .filter((c) => c.status === 'completed')
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const now = new Date();
  const monthlyEarnings = completedClasses
    .filter(
      (c) =>
        c.date.getMonth() === now.getMonth() &&
        c.date.getFullYear() === now.getFullYear()
    )
    .reduce((sum, c) => sum + (c.price ?? 0), 0);
  const growth = 0;

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

  return (
    <div className="pb-28 md:pb-10 space-y-6">

      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
            {todayLabel}
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Olá, {firstName}
          </h1>
        </div>
        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-white shadow-sm shrink-0">
          {profile ? (
            profile.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 font-bold text-lg">
                {profile.name?.charAt(0)?.toUpperCase()}
              </div>
            )
          ) : (
            <div className="animate-pulse w-full h-full bg-slate-200" />
          )}
        </div>
      </header>

      {/* Alerts */}
      {isInactive && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-4 items-center">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0">
            <AlertCircle size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-red-900">Conta Inativa / Credencial Vencida</h4>
            <p className="text-xs text-red-700 mt-0.5">
              Seu perfil está oculto no marketplace. Regularize para receber alunos.
            </p>
          </div>
          <Button size="sm" variant="primary" className="bg-red-600 hover:bg-red-700 shrink-0" onClick={onRegularize}>
            Regularizar
          </Button>
        </div>
      )}

      {!isInactive && isExpiring && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex gap-4 items-center">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
            <AlertCircle size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-orange-900">Credencial Vencendo</h4>
            <p className="text-xs text-orange-800 mt-0.5">
              Sua credencial do DETRAN vence em {daysToExpiry} dias. Renove para evitar bloqueios.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            className="bg-orange-500 hover:bg-orange-600 shrink-0 text-white"
            onClick={onRenew}
          >
            Renovar
          </Button>
        </div>
      )}

      {/* KPIs */}
      <KPISection
        availableBalance={availableBalance}
        pendingBalance={pendingBalance}
        monthlyEarnings={monthlyEarnings}
        growth={growth}
      />

      {/* Desktop 2-column: Schedule (60%) + Feedback (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* Today's Schedule */}
        <section className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Agenda de Hoje</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {todayClasses.length} aula{todayClasses.length !== 1 ? 's' : ''} agendada{todayClasses.length !== 1 ? 's' : ''}
              </p>
            </div>
            {todayClasses.length > 0 && (
              <button
                onClick={onViewSchedule}
                className="text-velo-blue text-sm font-semibold hover:underline underline-offset-2"
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
                    <p className="font-black text-slate-900 text-sm tabular-nums">{item.startTime}</p>
                  </div>
                  <div className={cn(
                    'flex-1 flex justify-between items-center p-3 rounded-xl',
                    item.status === 'completed'
                      ? 'bg-slate-50 opacity-60'
                      : item.status === 'in-progress'
                      ? 'bg-orange-50'
                      : 'bg-slate-50'
                  )}>
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        item.status === 'completed' ? "bg-velo-green" :
                        item.status === 'in-progress' ? "bg-orange-500" :
                        "bg-velo-blue"
                      )} />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{item.studentName || 'Aluno'}</p>
                        <p className={cn(
                          'text-xs font-medium mt-0.5',
                          item.status === 'in-progress' ? 'text-orange-600' : 'text-slate-400'
                        )}>
                          {item.status === 'in-progress' ? 'Em andamento' : 'Aula Prática'}
                        </p>
                      </div>
                    </div>
                    {item.status === 'completed' ? (
                      <CheckCircle2 size={18} className="text-velo-green" />
                    ) : (
                      <button
                        disabled
                        title="Chat disponível em breve"
                        aria-label="Enviar mensagem"
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-300 flex items-center justify-center cursor-not-allowed"
                      >
                        <MessageCircle size={14} aria-hidden="true" />
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
                className="py-10 rounded-xl border border-dashed border-slate-200"
              />
            )}
          </div>
        </section>

        {/* Completed Classes / Feedback */}
        <section className="lg:col-span-2">
          <div className="mb-5">
            <h2 className="text-base font-bold text-slate-900">Aulas Concluídas</h2>
            <p className="text-xs text-slate-400 mt-0.5">Feedback pendente ou enviado</p>
          </div>

          {completedClasses.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {completedClasses.slice(0, 6).map((cls) => (
                <div key={cls.id} className="py-4 first:pt-0">
                  <div className="flex justify-between items-start mb-2.5">
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
                      <p className="text-[10px] font-black text-velo-blue mb-1 flex items-center gap-1">
                        <CheckCircle2 size={10} aria-hidden="true" /> Feedback enviado
                      </p>
                      <p className="text-xs text-slate-500 italic leading-relaxed">
                        "{cls.instructorFeedback}"
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setFeedbackClassId(cls.id)}
                      className="w-full py-2 text-xs font-semibold text-velo-blue hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-blue-100 hover:border-velo-blue/30"
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
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-velo-blue/20 focus:border-velo-blue/40 outline-none resize-none text-sm bg-slate-50 mb-5"
                rows={4}
                placeholder="Descreva o desempenho do aluno..."
                autoFocus
              />

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setFeedbackClassId(null)}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-velo-blue hover:bg-velo-blue-dark text-white"
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
