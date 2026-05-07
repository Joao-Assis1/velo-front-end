"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  PlayCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui-custom";
import { cn } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import { submitInstructorFeedbackAction } from "@/lib/actions/profileActions";
import { BiometryOverlay } from "@/components/features/BiometryOverlay";
import { TelemetryHUD } from "@/components/features/TelemetryHUD";

export type LessonData = {
  id: string;
  date: Date | string;
  startTime: string;
  status: "UPCOMING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  studentName: string;
  studentImage?: string;
  location?: string;
  instructorFeedback?: string;
};

export const LessonCard = ({
  lesson,
  onUpdate,
}: {
  lesson: LessonData;
  onUpdate?: () => void;
}) => {
  const { checkIn, checkOut } = useApp();
  const [currentStatus, setCurrentStatus] = useState(lesson.status);
  const [isLoading, setIsLoading] = useState(false);

  // Modal States
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState(
    lesson.instructorFeedback || "",
  );
  const [hasFeedback, setHasFeedback] = useState(!!lesson.instructorFeedback);

  // Compliance Flows
  const [showBiometry, setShowBiometry] = useState<'check-in' | 'check-out' | null>(null);
  const [showTelemetry, setShowTelemetry] = useState(currentStatus === 'IN_PROGRESS');

  const handleStartCheckIn = () => setShowBiometry('check-in');
  
  const executeCheckIn = async () => {
    setShowBiometry(null);
    try {
      setIsLoading(true);
      checkIn(lesson.id);
      setCurrentStatus("IN_PROGRESS");
      setShowTelemetry(true);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Falha ao iniciar aula:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTelemetryFinish = () => {
    setShowTelemetry(false);
    setShowBiometry('check-out');
  };

  const executeCheckOut = async () => {
    setShowBiometry(null);
    try {
      setIsLoading(true);
      checkOut(lesson.id);
      setCurrentStatus("COMPLETED");
      setShowFeedbackModal(true); // Abre modal de feedback
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Falha ao finalizar aula:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      setIsLoading(true);
      const result = await submitInstructorFeedbackAction(
        lesson.id,
        feedbackText,
      );
      if (result.success) {
        setHasFeedback(true);
        setShowFeedbackModal(false);
        if (onUpdate) onUpdate();
      } else {
        console.error("Erro ao enviar feedback:", result.error);
      }
    } catch (error) {
      console.error("Falha ao enviar feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const lessonDate = new Date(lesson.date);
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(lessonDate);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4 flex flex-col gap-4 relative overflow-hidden">
      {/* Status Bar Indicator */}
      <div
        className={cn(
          "absolute top-0 left-0 w-1 h-full",
          currentStatus === "UPCOMING"
            ? "bg-velo-blue"
            : currentStatus === "IN_PROGRESS"
              ? "bg-velo-green"
              : currentStatus === "COMPLETED"
                ? "bg-slate-300"
                : "bg-red-400",
        )}
      />

      <div className="flex justify-between items-start pl-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-50 bg-slate-100 flex items-center justify-center">
            {lesson.studentImage ? (
              <img
                src={lesson.studentImage}
                alt={lesson.studentName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-slate-400" size={24} />
            )}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              {lesson.studentName}
            </h4>
            <p className="text-xs font-medium text-slate-500 capitalize flex items-center gap-1 mt-0.5">
              <Clock size={12} /> {formattedDate} • {lesson.startTime}
            </p>
          </div>
        </div>

        <span
          className={cn(
            "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide",
            currentStatus === "UPCOMING"
              ? "bg-blue-50 text-velo-blue"
              : currentStatus === "IN_PROGRESS"
                ? "bg-green-50 text-velo-green"
                : currentStatus === "COMPLETED"
                  ? "bg-slate-100 text-slate-500"
                  : "bg-red-50 text-red-500",
          )}
        >
          {currentStatus === "IN_PROGRESS"
            ? "Em Andamento"
            : currentStatus === "COMPLETED"
              ? "Concluída"
              : currentStatus === "CANCELLED"
                ? "Cancelada"
                : "Agendada"}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="pl-2 pt-2 border-t border-slate-50 mt-1">
        {currentStatus === "UPCOMING" && (
          <Button
            className="w-full py-3 bg-velo-blue hover:bg-blue-600 flex items-center gap-2 justify-center"
            onClick={handleStartCheckIn}
            disabled={isLoading}
          >
            <PlayCircle size={18} />
            {isLoading ? "Iniciando..." : "Iniciar Aula (Check-in)"}
          </Button>
        )}

        {currentStatus === "IN_PROGRESS" && (
          <Button
            className="w-full py-3 bg-velo-green hover:bg-green-600 border-none text-white flex items-center gap-2 justify-center"
            onClick={() => setShowTelemetry(true)}
            disabled={isLoading}
          >
            <PlayCircle size={18} />
            Ver Telemetria / Finalizar
          </Button>
        )}

        {currentStatus === "COMPLETED" && !hasFeedback && (
          <Button
            variant="outline"
            className="w-full py-3 border-orange-200 text-orange-600 hover:bg-orange-50 flex items-center gap-2 justify-center"
            onClick={() => setShowFeedbackModal(true)}
          >
            <MessageSquare size={18} />
            Avaliar Aluno
          </Button>
        )}

        {currentStatus === "COMPLETED" && hasFeedback && (
          <p className="text-xs text-slate-400 flex items-center gap-1.5 justify-center py-2 bg-slate-50 rounded-lg">
            <CheckCircle2 size={14} className="text-velo-green" />
            Feedback enviado
          </p>
        )}
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowFeedbackModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm relative z-10 shadow-xl"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Avaliação da Aula
              </h3>
              <p className="text-slate-500 text-sm mb-4">
                Como foi o desempenho de{" "}
                <span className="font-semibold text-slate-700">
                  {lesson.studentName}
                </span>{" "}
                nesta aula? Isso ajuda no acompanhamento.
              </p>

              <textarea
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-velo-blue outline-none resize-none min-h-[120px] mb-4 bg-slate-50"
                placeholder="Pontos fortes, o que precisa melhorar na próxima aula..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />

              <Button
                className="w-full"
                onClick={handleSubmitFeedback}
                disabled={isLoading || !feedbackText.trim()}
              >
                {isLoading ? "Salvando..." : "Salvar Feedback"}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Compliance Overlays */}
      <AnimatePresence>
        {showBiometry && (
          <BiometryOverlay
            lessonId={lesson.id}
            stage={showBiometry === 'check-in' ? 'START' : 'END'}
            studentName={lesson.studentName}
            studentImage={lesson.studentImage}
            onSuccess={showBiometry === 'check-in' ? executeCheckIn : executeCheckOut}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTelemetry && (
          <TelemetryHUD
            studentName={lesson.studentName}
            onFinish={handleTelemetryFinish}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
