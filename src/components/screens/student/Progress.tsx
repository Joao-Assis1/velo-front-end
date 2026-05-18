"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui-custom";
import { ScheduledClass } from "@/types";
import { submitStudentFeedbackAction } from "@/lib/actions/profileActions";
import { cn } from "@/lib/utils";

export const StudentProgress = ({
  classes = [],
}: {
  classes?: ScheduledClass[];
}) => {
  const [ratingClass, setRatingClass] = useState<ScheduledClass | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalHoursRequired = 2;

  const normalizedClasses = classes.map((c) => ({
    ...c,
    status: c.status.toLowerCase() as ScheduledClass['status'],
  }));

  const completedClasses = normalizedClasses
    .filter((c) => c.status === "completed")
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const upcomingClasses = normalizedClasses
    .filter((c) => c.status === "upcoming" || c.status === "in-progress" || c.status === "pending_acceptance")
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const hoursCompleted = completedClasses.length;
  const progressPercentage = Math.min((hoursCompleted / totalHoursRequired) * 100, 100);

  const handleFeedbackSubmit = async () => {
    if (!ratingClass || rating === 0) return;
    setIsSubmitting(true);
    try {
      const result = await submitStudentFeedbackAction(ratingClass.id, rating, feedback);
      if (result.success) {
        setRatingClass(null);
        setRating(0);
        setFeedback("");
        window.location.reload();
      } else {
        console.error("Erro ao enviar avaliação:", result.error);
      }
    } catch (error) {
      console.error("Falha ao enviar avaliação:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-28 md:pb-10">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Meu Progresso</h1>
        <p className="text-slate-400 text-sm mt-0.5">Acompanhe sua evolução nas aulas</p>
      </header>

      {/* Progress Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Aulas realizadas</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900 tabular-nums leading-none">{hoursCompleted}</span>
              <span className="text-lg text-slate-400 font-medium">/ {totalHoursRequired}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Mínimo para a prova prática</p>
          </div>

          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-velo-green"
                strokeDasharray={`${progressPercentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black text-slate-700">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-400">
            <span>{Math.round(progressPercentage)}% concluído</span>
            <span>
              {Math.max(0, totalHoursRequired - hoursCompleted)} restante{Math.max(0, totalHoursRequired - hoursCompleted) !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-velo-green rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Requirement note */}
      <div className="border border-slate-200 rounded-xl p-4 mb-8">
        <p className="text-xs font-black text-slate-700 mb-1 uppercase tracking-wide">Requisito para a Prova</p>
        <p className="text-xs text-slate-500 leading-relaxed">
          Complete no mínimo{" "}
          <strong className="text-slate-800 font-bold">{totalHoursRequired} horas</strong>{" "}
          de aulas práticas para o exame de direção do DETRAN (Res. 1.020/25 CONTRAN).
        </p>
      </div>

      {/* Upcoming Classes */}
      <section className="mb-8">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Próximas Aulas</h2>
        {upcomingClasses.length > 0 ? (
          <div className="space-y-2">
            {upcomingClasses.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.2 }}
                className="flex gap-4 items-center bg-white rounded-xl border border-slate-100 p-4"
              >
                <div className="shrink-0 w-11 text-center">
                  <div className={cn(
                    "text-2xl font-black leading-none tabular-nums",
                    cls.status === "in-progress" ? "text-orange-500" : cls.status === "pending_acceptance" ? "text-amber-500" : "text-velo-blue"
                  )}>
                    {format(cls.date, "dd")}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                    {format(cls.date, "MMM", { locale: ptBR })}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm leading-tight">{cls.instructorName}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {cls.startTime} ·{" "}
                    {(cls.price || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                </div>
                <span className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wide shrink-0",
                  cls.status === "in-progress"
                    ? "bg-orange-100 text-orange-600"
                    : cls.status === "pending_acceptance"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-blue-50 text-velo-blue"
                )}>
                  {cls.status === "in-progress" ? "Em Andamento" : cls.status === "pending_acceptance" ? "Aguardando" : "Agendada"}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-6 rounded-xl border border-dashed border-slate-200 text-center">
            <p className="text-slate-400 text-sm">Nenhuma aula agendada.</p>
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Histórico de Aulas</h2>
        {completedClasses.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {completedClasses.map((cls, i) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="py-4 first:pt-0"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-2 h-2 rounded-full bg-velo-green mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{cls.instructorName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {format(cls.date, "dd/MM/yyyy", { locale: ptBR })} · {cls.startTime} ·{" "}
                        {(cls.price || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase shrink-0">
                    Concluída
                  </span>
                </div>

                <div className="ml-5 space-y-2">
                  {cls.instructorFeedback ? (
                    <div className="bg-blue-50/60 px-3 py-2 rounded-lg">
                      <p className="text-[10px] font-black text-velo-blue uppercase tracking-wider mb-1">Instrutor</p>
                      <p className="text-xs text-slate-600 italic">"{cls.instructorFeedback}"</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Aguardando feedback do instrutor.</p>
                  )}

                  <div className="pt-2 border-t border-slate-100">
                    {cls.studentFeedbackRating ? (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={11}
                              className={star <= cls.studentFeedbackRating! ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400 font-medium">Sua avaliação</span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full py-2 text-xs border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-velo-blue hover:border-velo-blue/30 flex items-center justify-center gap-1.5 transition-colors"
                        onClick={() => setRatingClass(cls)}
                      >
                        <MessageSquare size={13} />
                        Avaliar aula
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">Nenhuma aula concluída ainda.</p>
            <p className="text-xs text-slate-300 mt-1">Suas aulas finalizadas aparecerão aqui.</p>
          </div>
        )}
      </section>

      {/* Rating Modal */}
      <AnimatePresence>
        {ratingClass && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setRatingClass(null)}
            />
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10"
            >
              <h3 className="text-lg font-black text-slate-900 mb-1">Avaliar aula</h3>
              <p className="text-slate-500 text-sm mb-5">
                Como foi com{" "}
                <span className="font-bold text-slate-700">{ratingClass.instructorName}</span>?
              </p>

              <div className="flex justify-center gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      size={36}
                      className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-100"}
                    />
                  </button>
                ))}
              </div>

              <textarea
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-velo-blue/20 focus:border-velo-blue/40 outline-none resize-none min-h-[90px] bg-slate-50 mb-5"
                placeholder="O que você mais gostou? (opcional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setRatingClass(null)}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-velo-blue text-white"
                  onClick={handleFeedbackSubmit}
                  disabled={isSubmitting || rating === 0}
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
