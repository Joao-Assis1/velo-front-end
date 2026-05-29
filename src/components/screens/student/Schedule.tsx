"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Star, AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui-custom';
import { ScheduledClass } from '@/types';
import { EmptyState } from '@/components/ui-custom/EmptyState';

export const StudentSchedule = ({
  classes,
  onCancelClass,
  onRateClass,
  topBanner,
}: {
  classes: ScheduledClass[],
  onCancelClass: (id: string) => Promise<void>,
  onRateClass: (id: string, rating: number, text: string) => void,
  topBanner?: React.ReactNode,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [classToCancel, setClassToCancel] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [classToRate, setClassToRate] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');

  const upcomingClasses = useMemo(() =>
    classes
      .filter(c => c.status === 'pending_acceptance' || c.status === 'upcoming' || c.status === 'in-progress')
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [classes]
  );
  const pastClasses = useMemo(() =>
    classes
      .filter(c => c.status === 'completed' || c.status === 'cancelled')
      .sort((a, b) => b.date.getTime() - a.date.getTime()),
    [classes]
  );

  const handleRateSubmit = () => {
    if (classToRate && rating > 0) {
      onRateClass(classToRate, rating, feedbackText);
      setClassToRate(null);
      setRating(0);
      setFeedbackText('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark header com tabs integradas */}
      <div className="sticky top-0 z-20 bg-gradient-to-br from-slate-900 to-slate-800 px-5 pt-6 pb-4 overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto w-full relative z-10">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-400">Agenda</p>
          <div className="flex items-end justify-between mt-0.5">
            <h1 className="text-xl font-extrabold text-slate-50">Minhas Aulas</h1>
            <span className="text-xs text-slate-400 mb-0.5 font-medium">
              {activeTab === 'upcoming'
                ? `${upcomingClasses.length} agendada${upcomingClasses.length !== 1 ? 's' : ''}`
                : `${pastClasses.length} realizada${pastClasses.length !== 1 ? 's' : ''}`}
            </span>
          </div>
          {/* Tabs de navegação */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                activeTab === 'upcoming' ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "bg-white/10 text-slate-300 hover:bg-white/15"
              )}
            >
              Próximas {upcomingClasses.length > 0 && `(${upcomingClasses.length})`}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                activeTab === 'past' ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "bg-white/10 text-slate-300 hover:bg-white/15"
              )}
            >
              Histórico {pastClasses.length > 0 && `(${pastClasses.length})`}
            </button>
          </div>
        </div>
      </div>

      {topBanner && (
        <div className="w-full px-4 md:px-6 pt-4">
          {topBanner}
        </div>
      )}

      {/* Contêiner Geral Alinhado para o Conteúdo */}
      <div className="w-full px-4 md:px-6 pb-28 md:pb-12 pt-4">
        {activeTab === 'upcoming' ? (
          upcomingClasses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {upcomingClasses.map((cls, i) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className={cn(
                    "bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-all",
                    i === 0 && "border-blue-100 shadow-md shadow-blue-50/50 border-l-[3px] border-l-blue-600"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm leading-tight">{cls.instructorName}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        {format(cls.date, "EEEE, dd 'de' MMMM · HH:mm", { locale: ptBR })}
                      </p>
                      {cls.payment?.status && cls.payment.status !== 'COMPLETED' && (
                        <p className={cn(
                          "text-[10px] font-bold mt-1.5 flex items-center gap-1",
                          cls.payment.status === 'PENDING' ? "text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md w-fit" :
                          cls.payment.status === 'OVERDUE' ? "text-red-600 bg-red-50 px-2 py-0.5 rounded-md w-fit" :
                          "text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit"
                        )}>
                          ● {cls.payment.status === 'PENDING' ? 'Pagamento pendente' :
                             cls.payment.status === 'OVERDUE' ? 'Pagamento vencido' : 'Reembolsado'}
                        </p>
                      )}
                    </div>
                    <span className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0",
                      cls.status === 'pending_acceptance' ? "bg-amber-50 text-amber-600" :
                      cls.status === 'in-progress' ? "bg-orange-50 text-orange-600 animate-pulse" :
                      "bg-blue-50 text-blue-600"
                    )}>
                      {cls.status === 'pending_acceptance' ? 'Aguardando' :
                       cls.status === 'in-progress' ? 'Em andamento' : 'Agendada'}
                    </span>
                  </div>

                  {(cls.status === 'upcoming' || cls.status === 'pending_acceptance') && (
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => setClassToCancel(cls.id)}
                        className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
                      >
                        Cancelar
                      </button>
                      <Link
                        href={`/app/student/instructors/${cls.instructorId}`}
                        className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center cursor-pointer active:scale-95 border border-slate-100"
                      >
                        Ver instrutor ›
                      </Link>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="Nenhuma aula agendada"
              description="Visite o marketplace na Home e selecione um instrutor para iniciar suas aulas."
            />
          )
        ) : (
          pastClasses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pastClasses.map((cls, i) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className={cn(
                    "bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-all border-l-[3px]",
                    cls.status === 'completed' ? "border-l-green-500" : "border-l-slate-300"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm leading-tight">{cls.instructorName}</p>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={12} className="text-slate-400" />
                        {format(cls.date, "dd/MM/yyyy · HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <span className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-full uppercase shrink-0",
                      cls.status === 'completed' ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
                    )}>
                      {cls.status === 'completed' ? 'Concluída' : 'Cancelada'}
                    </span>
                  </div>

                  {cls.status === 'completed' && (
                    <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-3">
                      {cls.studentFeedbackRating !== undefined ? (
                        <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <div className="flex gap-0.5 shrink-0">
                            {[...Array(5)].map((_, j) => (
                              <Star
                                key={j}
                                size={11}
                                className={j < cls.studentFeedbackRating! ? "fill-amber-400 text-amber-400" : "text-slate-200 fill-slate-100"}
                              />
                            ))}
                          </div>
                          {cls.studentFeedbackText && (
                            <p className="text-xs text-slate-600 italic font-medium truncate">"{cls.studentFeedbackText}"</p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setClassToRate(cls.id)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer bg-blue-50 px-2.5 py-1.5 rounded-lg w-fit"
                        >
                          <Star size={12} className="fill-blue-600" /> Avaliar aula
                        </button>
                      )}

                      {cls.instructorFeedback && (
                        <div className="bg-slate-50 border border-slate-100 px-3 py-2.5 rounded-xl">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-0.5">Comentário do Instrutor</p>
                          <p className="text-xs text-slate-600 leading-normal font-medium">"{cls.instructorFeedback}"</p>
                        </div>
                      )}

                      {!cls.disputeOpened && cls.checkOutTime &&
                        (Date.now() - cls.checkOutTime.getTime() <= 48 * 60 * 60 * 1000) && (
                        <Link
                          href="/app/student/dispute"
                          className="text-xs text-red-500 font-extrabold hover:text-red-700 flex items-center gap-1 transition-colors w-fit underline decoration-red-200 underline-offset-2"
                        >
                          <AlertTriangle size={12} /> Contestar pagamento
                        </Link>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Calendar}
              title="Nenhuma aula no histórico"
              description="Aulas passadas ou canceladas serão mostradas aqui."
            />
          )
        )}
      </div>

      {/* Bottom Sheet de Cancelamento */}
      <AnimatePresence>
        {classToCancel && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setClassToCancel(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-3xl p-6 w-full max-w-md relative z-10 shadow-2xl border-t border-slate-100 pb-8"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle size={24} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">Cancelar esta aula?</h3>
                <p className="text-slate-500 text-xs px-4 mb-6 leading-relaxed">
                  Cancelamentos com menos de 24h de antecedência podem sofrer retenção ou taxas. Deseja prosseguir?
                </p>
              </div>

              {cancelError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600">
                  {cancelError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setClassToCancel(null); setCancelError(null); }}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
                >
                  Manter aula
                </button>
                <button
                  disabled={isCancelling}
                  onClick={async () => {
                    if (!classToCancel) return;
                    setIsCancelling(true);
                    setCancelError(null);
                    try {
                      await onCancelClass(classToCancel);
                      setClassToCancel(null);
                    } catch (err: any) {
                      setCancelError(err.message || 'Não foi possível cancelar a aula');
                    } finally {
                      setIsCancelling(false);
                    }
                  }}
                  className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white text-sm font-extrabold rounded-xl transition-all cursor-pointer disabled:opacity-40"
                >
                  {isCancelling ? 'Cancelando...' : 'Confirmar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Bottom Sheet de Avaliação */}
        {classToRate && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setClassToRate(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-t-3xl p-6 w-full max-w-md relative z-10 shadow-2xl border-t border-slate-100 pb-8"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5" />
              <div className="text-center">
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">Avaliar aula concluída</h3>
                <p className="text-slate-400 text-xs mb-5">Sua avaliação ajuda a melhorar a comunidade Velo</p>

                <div className="flex justify-center gap-3 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <Star
                        size={32}
                        className={cn(
                          "transition-colors",
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200 fill-slate-100"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600/40 resize-none text-sm bg-slate-50 mb-5 text-slate-900 placeholder:text-slate-400"
                rows={3}
                placeholder="Como foi a didática e o carro do instrutor? (Opcional)"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setClassToRate(null)}
                  className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  onClick={handleRateSubmit}
                  disabled={rating === 0}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold rounded-xl transition-all cursor-pointer disabled:opacity-40"
                >
                  Enviar feedback
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
