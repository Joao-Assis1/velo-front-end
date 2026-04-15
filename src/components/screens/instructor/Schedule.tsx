"use client";

import React from "react";
import { Calendar, History, Plus, X } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScheduledClass } from "@/types";
import { EmptyState } from "@/components/ui-custom/EmptyState";
import { LessonCard, LessonData } from "./LessonCard";
import { BlockTimeForm } from "@/components/features/BlockTimeForm";
import { motion, AnimatePresence } from "motion/react";

export const InstructorSchedule = ({
  classes,
  onGiveFeedback,
  onCheckIn,
  onCheckOut,
  onNavigate,
}: {
  classes: ScheduledClass[];
  onGiveFeedback: (id: string, feedback: string) => void;
  onCheckIn: (id: string) => void;
  onCheckOut: (id: string) => void;
  onNavigate: (screen: any) => void;
}) => {
  const [isBlockModalOpen, setIsBlockModalOpen] = React.useState(false);

  // Sort classes by date and time
// ... (rest of sorting logic)
  const sortedClasses = [...classes].sort((a, b) => {
    const dateDiff = a.date.getTime() - b.date.getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  const upcomingClasses = sortedClasses.filter(
    (c) => c.status === "upcoming" || c.status === "in-progress",
  );
  const pastClasses = sortedClasses
    .filter((c) => c.status === "completed" || c.status === "cancelled")
    .reverse();

  const groupedUpcoming = upcomingClasses.reduce(
    (acc, cls) => {
      const dateKey = format(cls.date, "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(cls);
      return acc;
    },
    {} as Record<string, ScheduledClass[]>,
  );

  const mapToLessonData = (cls: ScheduledClass): LessonData => ({
    id: cls.id,
    date: cls.date,
    startTime: cls.startTime,
    status:
      cls.status === "upcoming"
        ? "UPCOMING"
        : cls.status === "in-progress"
          ? "IN_PROGRESS"
          : cls.status === "completed"
            ? "COMPLETED"
            : "CANCELLED",
    studentName: cls.studentName || "Aluno",
    studentImage: cls.studentImage,
    instructorFeedback: cls.instructorFeedback,
  });

  return (
    <div className="pb-24 pt-6 px-4 space-y-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agenda Completa</h1>
          <p className="text-slate-500 text-sm">
            Gerencie suas aulas e horários
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate("instructor-availability")}
            className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-colors flex items-center gap-2 text-xs font-bold"
          >
            <Calendar size={18} />
            <span className="hidden sm:inline">Disponibilidade</span>
          </button>
          <button
            onClick={() => setIsBlockModalOpen(true)}
            className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors flex items-center gap-2 text-xs font-bold"
          >
            <Plus size={18} />
            <span>Bloquear</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isBlockModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <BlockTimeForm 
                onClose={() => setIsBlockModalOpen(false)}
                onSuccess={() => {
                  setIsBlockModalOpen(false);
                  window.location.reload();
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-velo-blue" />
          Próximas Aulas
        </h2>
        {upcomingClasses.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedUpcoming).map(([dateKey, dayClasses]) => {
              const date = new Date(dateKey + "T00:00:00");
              const dateLabel = isToday(date)
                ? "Hoje"
                : isTomorrow(date)
                  ? "Amanhã"
                  : format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });

              return (
                <div key={dateKey}>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">
                    {dateLabel}
                  </h3>
                  <div className="space-y-3">
                    {dayClasses.map((cls) => (
                      <LessonCard
                        key={cls.id}
                        lesson={mapToLessonData(cls)}
                        onUpdate={() => window.location.reload()}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="Sem agendamentos"
            description="Você não tem nenhuma aula agendada para os próximos dias."
            className="py-12 bg-slate-50 rounded-2xl border border-slate-100 border-dashed"
          />
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <History size={20} className="text-slate-400" />
          Histórico Recente
        </h2>
        <div className="space-y-3">
          {pastClasses.length > 0 ? (
            pastClasses
              .slice(0, 10)
              .map((cls) => (
                <LessonCard
                  key={cls.id}
                  lesson={mapToLessonData(cls)}
                  onUpdate={() => window.location.reload()}
                />
              ))
          ) : (
            <p className="text-center text-slate-400 text-sm py-4">
              Nenhum histórico disponível.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
