"use client";

import React from "react";
import { Bell, Calendar, History, Plus } from "lucide-react";
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

  const sortedClasses = [...classes].sort((a, b) => {
    const dateDiff = a.date.getTime() - b.date.getTime();
    if (dateDiff !== 0) return dateDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  const pendingClasses = sortedClasses.filter((c) => c.status === "pending_acceptance");
  const upcomingClasses = sortedClasses.filter(
    (c) => c.status === "upcoming" || c.status === "in-progress"
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
    {} as Record<string, ScheduledClass[]>
  );

  const mapToLessonData = (cls: ScheduledClass): LessonData => ({
    id: cls.id,
    date: cls.date,
    startTime: cls.startTime,
    price: cls.price,
    status:
      cls.status === "pending_acceptance"
        ? "PENDING_ACCEPTANCE"
        : cls.status === "upcoming"
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
    <div className="pb-28 md:pb-10">

      {/* Hero strip */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 -mx-4 md:-mx-8 -mt-6 px-4 md:px-8 pt-6 pb-5 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Agenda de aulas</p>
          <div className="flex items-center justify-between mt-1 gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight">Próximas Aulas</h1>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onNavigate("instructor-availability")}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Calendar size={14} />
                <span className="hidden sm:inline">Disponibilidade</span>
              </button>
              <button
                onClick={() => setIsBlockModalOpen(true)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Bloquear</span>
              </button>
            </div>
          </div>

          {/* KPI tiles */}
          <div className="flex gap-2 mt-4">
            <div className="bg-white/7 border border-white/10 rounded-xl px-3 py-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Esta semana</p>
              <p className="text-lg font-black text-white mt-0.5">{upcomingClasses.length}</p>
              <p className="text-[9px] text-slate-600">aulas</p>
            </div>
            {pendingClasses.length > 0 && (
              <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-amber-400">Pendentes</p>
                <p className="text-lg font-black text-white mt-0.5">{pendingClasses.length}</p>
                <p className="text-[9px] text-amber-400/70">solicitações</p>
              </div>
            )}
          </div>
        </div>
      </div>

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

      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Pending requests */}
        {pendingClasses.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Bell size={16} className="text-amber-500" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Solicitações Pendentes</p>
              <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                {pendingClasses.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingClasses.map((cls) => (
                <LessonCard
                  key={cls.id}
                  lesson={mapToLessonData(cls)}
                  onUpdate={() => window.location.reload()}
                />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming grouped by date */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-blue-600" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Próximas Aulas</p>
          </div>
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
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap px-1">
                        {dateLabel}
                      </span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
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

        {/* History */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <History size={16} className="text-slate-400" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Histórico Recente</p>
          </div>
          <div className="space-y-3">
            {pastClasses.length > 0 ? (
              pastClasses.slice(0, 10).map((cls) => (
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
    </div>
  );
};
