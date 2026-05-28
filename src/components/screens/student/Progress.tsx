"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, MessageSquare, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScheduledClass } from "@/types";
import { useApp } from "@/context/AppContext";
import { useJourney, useDeclareReadyForExam } from "@/hooks/useJourney";
import { submitStudentFeedbackAction } from "@/lib/actions/lessons";
import { cn } from "@/lib/utils";

const MINIMUM_MINUTES = 120; // 2 hours required

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export const StudentProgress = () => {
  const { scheduledClasses, refreshLessons } = useApp();
  const { data: journey } = useJourney();
  const declareReadyMutation = useDeclareReadyForExam();

  const [ratingClass, setRatingClass] = useState<ScheduledClass | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [declareError, setDeclareError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refreshLessons(); }, []);

  const completedClasses = scheduledClasses
    .filter((c) => c.status.toLowerCase() === "completed")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const completedMinutes = completedClasses.reduce(
    (sum, c) => sum + (c.durationMinutes ?? 60),
    0,
  );
  const progressPct = Math.min((completedMinutes / MINIMUM_MINUTES) * 100, 100);
  const remainingMinutes = Math.max(MINIMUM_MINUTES - completedMinutes, 0);
  const minimumMet = completedMinutes >= MINIMUM_MINUTES;

  const strokeDashoffset = CIRCUMFERENCE - (progressPct / 100) * CIRCUMFERENCE;

  const canDeclare =
    minimumMet &&
    journey?.stage === "PRACTICAL_IN_PROGRESS" &&
    journey.blockers.every((b) => b.code !== "MINIMUM_LEGAL_NOT_MET");

  const handleFeedbackSubmit = async () => {
    if (!ratingClass || rating === 0) return;
    setIsSubmitting(true);
    try {
      const result = await submitStudentFeedbackAction(ratingClass.id, rating, feedback);
      if (result.success) {
        setRatingClass(null);
        setRating(0);
        setFeedback("");
        refreshLessons();
      } else {
        console.error("Erro ao enviar avaliação:", result.error);
      }
    } catch (error) {
      console.error("Falha ao enviar avaliação:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclare = async () => {
    setDeclareError(null);
    try {
      await declareReadyMutation.mutateAsync();
    } catch (err) {
      setDeclareError("Não foi possível declarar disponibilidade. Tente novamente.");
      console.error("Erro ao declarar para exame:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 pt-8 pb-8 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-400">
            Aulas Práticas
          </p>
          <h1 className="text-xl font-extrabold text-white mt-0.5">Progresso</h1>

          {/* Ring + Stats side by side */}
          <div className="flex items-center gap-8 mt-6">
            {/* SVG Ring */}
            <svg
              width="130"
              height="130"
              className="-rotate-90 shrink-0"
              aria-hidden="true"
            >
              {/* Background circle */}
              <circle
                cx="65"
                cy="65"
                r={RADIUS}
                fill="none"
                stroke="white"
                strokeOpacity="0.1"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="65"
                cy="65"
                r={RADIUS}
                fill="none"
                stroke={minimumMet ? "#22c55e" : "#3b82f6"}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700"
              />
            </svg>

            {/* Stats */}
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Horas feitas</p>
                <p className="text-2xl font-extrabold text-white leading-tight">
                  {formatMinutes(completedMinutes)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">
                  {minimumMet ? "Mínimo legal" : "Ainda faltam"}
                </p>
                <p className={cn(
                  "text-lg font-bold leading-tight",
                  minimumMet ? "text-green-400" : "text-white",
                )}>
                  {minimumMet ? "Atingido ✓" : formatMinutes(remainingMinutes)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Aulas concluídas</p>
                <p className="text-lg font-bold text-white leading-tight">
                  {completedClasses.length}
                </p>
              </div>
            </div>
          </div>

          {/* Linear progress bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>0h</span>
              <span>mínimo: 2h</span>
            </div>
            <div className="bg-white/10 rounded-full h-1.5">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  minimumMet ? "bg-green-400" : "bg-blue-400",
                )}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 pb-28 md:pb-12 pt-5 space-y-5">
        {/* Status / declare block — only when PRACTICAL_IN_PROGRESS */}
        {journey?.stage === "PRACTICAL_IN_PROGRESS" && (
          <div
            className={cn(
              "rounded-2xl p-4",
              minimumMet
                ? "bg-green-50 border border-green-200"
                : "bg-slate-100 border border-slate-200",
            )}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={20}
                className={cn(
                  "mt-0.5 shrink-0",
                  minimumMet ? "text-green-600" : "text-slate-400",
                )}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-bold",
                    minimumMet ? "text-green-800" : "text-slate-700",
                  )}
                >
                  {minimumMet
                    ? "Mínimo legal atingido!"
                    : "Fase prática em andamento"}
                </p>
                <p
                  className={cn(
                    "text-xs mt-0.5",
                    minimumMet ? "text-green-700" : "text-slate-500",
                  )}
                >
                  {minimumMet
                    ? "Você pode se declarar pronto para o exame prático."
                    : `Ainda faltam ${formatMinutes(remainingMinutes)} para atingir o mínimo legal.`}
                </p>
                {declareError && (
                  <p className="text-xs text-red-600 mt-1">{declareError}</p>
                )}
              </div>
              {canDeclare && (
                <button
                  onClick={handleDeclare}
                  disabled={declareReadyMutation.isPending}
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 shrink-0"
                >
                  {declareReadyMutation.isPending ? "Aguarde..." : "Declarar"}
                  {!declareReadyMutation.isPending && <ChevronRight size={12} />}
                </button>
              )}
            </div>
          </div>
        )}

        {/* History section */}
        <section>
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-3">
            Histórico de aulas
          </p>

          {completedClasses.length > 0 ? (
            <div className="space-y-2">
              {completedClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 border-l-[3px] border-l-green-500 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Left */}
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">
                        {cls.instructorName ?? "Instrutor"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {format(new Date(cls.date), "dd 'de' MMMM · HH:mm", { locale: ptBR })}
                      </p>
                      {cls.durationMinutes != null && (
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock size={10} className="shrink-0" />
                          {formatMinutes(cls.durationMinutes)}
                        </p>
                      )}
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2 shrink-0">
                      {cls.studentFeedbackRating != null ? (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 flex items-center gap-1">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          {cls.studentFeedbackRating}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setRatingClass(cls);
                            setRating(0);
                            setFeedback("");
                          }}
                          className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          Avaliar
                        </button>
                      )}
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                        ● Feita
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
              <MessageSquare size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-500">Nenhuma aula concluída ainda</p>
              <p className="text-xs text-slate-400 mt-1">
                Complete aulas práticas para acompanhar seu progresso aqui.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Rating modal — bottom sheet */}
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
              <p className="text-sm text-slate-500 mb-5">
                {ratingClass.instructorName ?? "Instrutor"} ·{" "}
                {format(new Date(ratingClass.date), "dd 'de' MMMM", { locale: ptBR })}
              </p>
              <div className="flex gap-2 justify-center mb-5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    className="transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      size={36}
                      className={cn(
                        s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200",
                      )}
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
