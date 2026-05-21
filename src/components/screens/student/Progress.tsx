"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
    <div className="min-h-screen bg-slate-50">
      {/* Dark header com progress bar */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 pt-6 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/8 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto w-full relative z-10">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-400">Seu avanço</p>
          <div className="flex items-end justify-between mt-0.5">
            <h1 className="text-xl font-extrabold text-slate-50">Progresso</h1>
            <span className="text-xs text-slate-400 mb-0.5">{hoursCompleted}/{totalHoursRequired} aulas</span>
          </div>
          {/* Progress bar */}
          <div className="mt-3">
            <div className="bg-white/10 rounded-full h-1.5">
              <div
                className="bg-blue-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contêiner Geral Alinhado para o Conteúdo */}
      <div className="max-w-5xl mx-auto w-full px-4 md:px-6 pb-28 md:pb-12 pt-4">
        <div className={cn(
          "space-y-4",
          (upcomingClasses.length > 0 || completedClasses.length > 0) && "grid grid-cols-1 md:grid-cols-12 md:gap-6 md:space-y-0"
        )}>
          {/* Coluna Esquerda: Aulas Concluídas */}
          <div className={cn(
            "space-y-4",
            upcomingClasses.length > 0 ? "md:col-span-7" : "md:col-span-12 max-w-2xl mx-auto w-full"
          )}>
            <section>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Concluídas</p>
              {completedClasses.length > 0 ? (
                <div className="space-y-2">
                  {completedClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 border-l-[3px] border-l-green-500 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{cls.instructorName}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {format(cls.date, "dd 'de' MMMM · HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {cls.studentFeedbackRating ? (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 flex items-center gap-1">
                              <Star size={10} className="fill-amber-400 text-amber-400" /> {cls.studentFeedbackRating}
                            </span>
                          ) : (
                            <button
                              onClick={() => setRatingClass(cls)}
                              className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                            >
                              Avaliar
                            </button>
                          )}
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">● Feita</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
                  <MessageSquare size={32} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-500">Nenhuma aula concluída ainda</p>
                </div>
              )}
            </section>
          </div>

          {/* Coluna Direita: Próximas Aulas */}
          {upcomingClasses.length > 0 && (
            <div className="md:col-span-5 space-y-4">
              <section>
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">Próximas</p>
                <div className="space-y-2">
                  {upcomingClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="bg-white rounded-2xl shadow-sm border border-slate-100 border-l-[3px] border-l-blue-500 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{cls.instructorName}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {format(cls.date, "dd 'de' MMMM · HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                          ● {cls.status === "in-progress" ? "Em andamento" : cls.status === "pending_acceptance" ? "Aguardando" : "Agendada"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* Modal de avaliação — bottom sheet */}
      <AnimatePresence>
        {ratingClass && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
              onClick={() => setRatingClass(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 pb-10"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
              <h3 className="font-extrabold text-slate-900 text-lg mb-1">Avaliar aula</h3>
              <p className="text-sm text-slate-500 mb-5">{ratingClass.instructorName} · {format(ratingClass.date, "dd 'de' MMMM", { locale: ptBR })}</p>
              <div className="flex gap-2 justify-center mb-5">
                {[1,2,3,4,5].map((s) => (
                  <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110 active:scale-95">
                    <Star
                      size={36}
                      className={cn(s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200")}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Deixe um comentário (opcional)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition resize-none mb-4"
                rows={3}
              />
              <button
                onClick={handleFeedbackSubmit}
                disabled={rating === 0 || isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-extrabold rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-40"
              >
                {isSubmitting ? "Enviando..." : "Enviar avaliação"}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
