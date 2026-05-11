"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  Star,
  Calendar,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, Button } from "@/components/ui-custom";
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

  const totalHoursRequired = 2; // Correcting to user request: 2 hours minimum

  // Normalizing status checks to handle potential casing differences from the backend
  const normalizedClasses = classes.map((c) => ({
    ...c,
    status: c.status.toLowerCase() as ScheduledClass['status'],
  }));

  // Filter for completed classes
  const completedClasses = normalizedClasses
    .filter((c) => c.status === "completed")
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Filter for upcoming/in-progress classes
  const upcomingClasses = normalizedClasses
    .filter(
      (c) =>
        c.status === "upcoming" ||
        c.status === "in-progress",
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const hoursCompleted = completedClasses.length; // Assuming 1 hour per class for now
  const progressPercentage = Math.min(
    (hoursCompleted / totalHoursRequired) * 100,
    100,
  );

  const handleFeedbackSubmit = async () => {
    if (!ratingClass || rating === 0) return;
    setIsSubmitting(true);
    try {
      const result = await submitStudentFeedbackAction(
        ratingClass.id,
        rating,
        feedback,
      );
      if (result.success) {
        setRatingClass(null);
        setRating(0);
        setFeedback("");
        window.location.reload(); // Recarrega a página para buscar os dados atualizados com as estrelas
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
    <div className="pb-28 md:pb-10 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Meu Progresso</h1>
        <p className="text-slate-500 text-sm">
          Acompanhe sua evolução nas aulas
        </p>
      </header>

      <Card className="bg-gradient-to-br from-velo-blue to-velo-blue-dark text-white border-none p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-velo-blue-light text-sm font-medium mb-1">
              Aulas Realizadas
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{hoursCompleted}</span>
              <span className="text-lg text-velo-blue-light/70 font-normal">
                / {totalHoursRequired} horas
              </span>
            </div>
            <p className="text-xs text-velo-blue-light mt-2">
              Mínimo necessário para a prova prática
              <br />
              <span className="opacity-70">(Res. 1.020/25 CONTRAN)</span>
            </p>
          </div>

          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Background Circle */}
              <path
                className="text-velo-blue-light/20"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              {/* Progress Circle */}
              <path
                className="text-velo-green drop-shadow-md"
                strokeDasharray={`${progressPercentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-sm font-bold">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-velo-blue-light font-medium">
            <span>Progresso Total</span>
            <span>
              {Math.max(0, totalHoursRequired - hoursCompleted)} horas restantes
            </span>
          </div>
          <div className="h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-velo-green shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            />
          </div>
        </div>
      </Card>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start">
        <div className="bg-white p-2 rounded-full shadow-sm text-velo-blue shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm mb-1">
            Requisito para a Prova
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Você precisa completar no mínimo{" "}
            <span className="font-bold text-slate-900">
              {totalHoursRequired} horas
            </span>{" "}
            de aulas práticas para estar apto a realizar o exame de direção do
            DETRAN, conforme Resolução 1.020/25 do CONTRAN.
          </p>
        </div>
      </div>

      {/* Seção Próximas Aulas */}
      <section className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-velo-blue" />
          Próximas Aulas
        </h3>
        <div className="space-y-3">
          {upcomingClasses.length > 0 ? (
            upcomingClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 items-start relative overflow-hidden"
              >
                <div
                  className={cn(
                    "absolute top-0 left-0 w-1 h-full",
                    cls.status === "in-progress"
                      ? "bg-velo-green"
                      : "bg-velo-blue",
                  )}
                />
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-velo-blue shrink-0 font-bold text-xs flex-col ml-2">
                  <span>{format(cls.date, "dd")}</span>
                  <span className="uppercase text-[10px]">
                    {format(cls.date, "MMM", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {cls.instructorName}
                      </h4>
                      <p className="text-xs text-slate-500 mb-2">
                        {cls.startTime} •{" "}
                        {(cls.price || 0).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide",
                        cls.status === "in-progress"
                          ? "bg-green-50 text-velo-green"
                          : "bg-blue-50 text-velo-blue",
                      )}
                    >
                      {cls.status === "in-progress"
                        ? "Em Andamento"
                        : "Agendada"}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm">Nenhuma aula agendada.</p>
            </div>
          )}
        </div>
      </section>

      {/* Seção Histórico */}
      <section className="mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 size={20} className="text-velo-green" />
          Histórico de Aulas
        </h3>
        <div className="space-y-3">
          {completedClasses.length > 0 ? (
            completedClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 items-start"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-velo-blue shrink-0 font-bold text-xs flex-col">
                  <span>{format(cls.date, "dd")}</span>
                  <span className="uppercase text-[10px]">
                    {format(cls.date, "MMM", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {cls.instructorName}
                      </h4>
                      <p className="text-xs text-slate-500 mb-2">
                        {cls.startTime} •{" "}
                        {(cls.price || 0).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                      Concluída
                    </div>
                  </div>

                  {cls.instructorFeedback ? (
                    <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 italic border border-slate-100 mt-2 relative">
                      <div className="absolute -top-1.5 left-4 w-3 h-3 bg-slate-50 border-t border-l border-slate-100 rotate-45"></div>
                      <strong className="text-slate-700 block mb-1 not-italic">
                        Feedback do Instrutor:
                      </strong>
                      "{cls.instructorFeedback}"
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-2">
                      Aguardando feedback do instrutor.
                    </p>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    {cls.studentFeedbackRating ? (
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={
                                star <= cls.studentFeedbackRating!
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-200"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          Sua avaliação
                        </span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full py-2 text-xs border-orange-200 text-orange-600 hover:bg-orange-50 flex items-center justify-center gap-2"
                        onClick={() => setRatingClass(cls)}
                      >
                        <MessageSquare size={14} />
                        Avaliar Aula
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-sm">
                Nenhuma aula concluída ainda.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Suas aulas finalizadas aparecerão aqui.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal de Avaliação */}
      <AnimatePresence>
        {ratingClass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setRatingClass(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={32} className="fill-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">
                  Avaliar Aula
                </h3>
                <p className="text-slate-500 text-sm">
                  Como foi sua aula com{" "}
                  <span className="font-bold text-slate-700">
                    {ratingClass.instructorName}
                  </span>
                  ?
                </p>
              </div>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-2 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      size={36}
                      className={
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-200 fill-slate-100"
                      }
                    />
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Comentário (opcional)
                </label>
                <textarea
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-velo-blue outline-none resize-none min-h-[100px] bg-slate-50"
                  placeholder="O que você mais gostou? O que pode melhorar?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setRatingClass(null)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleFeedbackSubmit}
                  disabled={isSubmitting || rating === 0}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
