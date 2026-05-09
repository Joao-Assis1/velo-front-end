"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, LogOut, Star, MessageCircle, AlertTriangle, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, Button } from '@/components/ui-custom';
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

  const upcomingClasses = classes.filter(c => c.status === 'upcoming' || c.status === 'in-progress').sort((a, b) => a.date.getTime() - b.date.getTime());
  const pastClasses = classes.filter(c => c.status === 'completed' || c.status === 'cancelled').sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleRateSubmit = () => {
    if (classToRate && rating > 0) {
      onRateClass(classToRate, rating, feedbackText);
      setClassToRate(null);
      setRating(0);
      setFeedbackText('');
    }
  };

  return (
    <div className="pb-28 md:pb-10 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Minhas Aulas</h1>
        <p className="text-slate-500 text-sm">Gerencie seus agendamentos</p>
      </header>

      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-velo-blue" />
          Próximas Aulas
        </h2>
        <div className="space-y-3">
          {upcomingClasses.length > 0 ? (
            upcomingClasses.map((cls) => (
              <Card key={cls.id} className={cn("border-l-4", cls.status === 'in-progress' ? "border-l-orange-500" : "border-l-velo-blue")}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-slate-900">{cls.instructorName}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock size={14} />
                      {format(cls.date, "dd 'de' MMM", { locale: ptBR })} às {cls.startTime}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                     <span className={cn(
                       "text-xs font-bold px-2 py-1 rounded-full",
                       cls.status === 'in-progress' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-velo-blue"
                     )}>
                       {cls.status === 'in-progress' ? 'Em andamento' : 'Agendada'}
                     </span>
                     {cls.status === 'upcoming' && (
                       <button 
                         onClick={() => setClassToCancel(cls.id)}
                         className="text-xs text-red-500 font-medium hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                       >
                         <LogOut size={12} /> Cancelar
                       </button>
                     )}
                  </div>
                </div>


              </Card>
            ))
          ) : (
            <EmptyState 
              icon={Calendar}
              title="Nenhuma aula agendada"
              description="Você ainda não possui aulas marcadas para os próximos dias."
            />
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Histórico</h2>
        <div className="space-y-3">
          {pastClasses.length > 0 ? (
            pastClasses.map((cls) => (
              <Card key={cls.id} className="bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-slate-900">{cls.instructorName}</p>
                    <p className="text-sm text-slate-500">
                      {format(cls.date, "dd/MM/yyyy", { locale: ptBR })} • {cls.startTime}
                    </p>
                  </div>
                  <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-full",
                    cls.status === 'completed' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {cls.status === 'completed' ? 'Concluída' : 'Cancelada'}
                  </span>
                </div>
                
                {cls.status === 'completed' && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    {(cls.studentFeedbackRating !== undefined) ? (
                      <div className="bg-white p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className={i < cls.studentFeedbackRating! ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} 
                            />
                          ))}
                          <span className="text-xs font-bold text-slate-700 ml-1">Sua avaliação</span>
                        </div>
                        <p className="text-xs text-slate-600 italic">"{cls.studentFeedbackText}"</p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setClassToRate(cls.id)}
                        className="w-full py-2 text-sm font-medium text-velo-blue bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Star size={16} /> Avaliar Aula
                      </button>
                    )}

                    {cls.instructorFeedback && (
                      <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs font-bold text-velo-blue mb-1 flex items-center gap-1">
                          <MessageCircle size={12} /> Feedback do Instrutor
                        </p>
                        <p className="text-xs text-slate-700">"{cls.instructorFeedback}"</p>
                      </div>
                    )}

                    {!cls.disputeOpened && cls.checkOutTime &&
                      (Date.now() - new Date(cls.checkOutTime).getTime() <= 48 * 60 * 60 * 1000) && (
                      <div className="mt-2">
                        <Link
                          href="/app/student/dispute"
                          className="text-xs text-red-500 font-medium hover:text-red-700 flex items-center gap-1 w-fit px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <AlertTriangle size={12} /> Contestar pagamento
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">Nenhum histórico disponível.</p>
          )}
        </div>
      </section>

      <AnimatePresence>
        {classToCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setClassToCancel(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Cancelar Aula?</h3>
              <p className="text-slate-600 mb-6 text-center">
                Tem certeza que deseja cancelar esta aula? Esta ação não pode ser desfeita.
              </p>

              {cancelError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">
                  {cancelError}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => { setClassToCancel(null); setCancelError(null); }}>
                  Não, manter
                </Button>
                <Button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white shadow-red-200"
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
                >
                  {isCancelling ? 'Cancelando...' : 'Sim, cancelar'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {classToRate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setClassToRate(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">Avaliar Aula</h3>
              
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star 
                      size={32} 
                      className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
                    />
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Comentário (Opcional)</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-velo-blue focus:border-transparent outline-none resize-none text-sm"
                  rows={3}
                  placeholder="Como foi a aula?"
                />
              </div>
              
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setClassToRate(null)}>
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 bg-velo-blue hover:bg-velo-blue-dark text-white" 
                  onClick={handleRateSubmit}
                  disabled={rating === 0}
                >
                  Enviar Avaliação
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
