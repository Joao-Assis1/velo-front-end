"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Loader2, CalendarClock } from "lucide-react";

const InstructorSchedule = dynamic(
  () => import("@/components/screens/instructor/Schedule").then((m) => ({ default: m.InstructorSchedule })),
  { loading: () => <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-10 h-10 animate-spin text-velo-blue" /></div> },
);
import { useApp } from "@/context/AppContext";

const SCREEN_TO_PATH: Record<string, string> = {
  "instructor-availability": "/app/instructor/availability",
};

export default function InstructorSchedulePage() {
  const router = useRouter();
  const { scheduledClasses, giveFeedback, checkIn, checkOut, refreshLessons, instructorProfile } = useApp();
  const hasNoAvailability = instructorProfile && (!instructorProfile.availability || instructorProfile.availability.length === 0);

  useEffect(() => {
    refreshLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-4 md:px-8 py-6">
      {hasNoAvailability && (
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <CalendarClock className="mt-0.5 shrink-0 text-amber-500" size={20} />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-800">Configure sua disponibilidade</p>
            <p className="mt-0.5 text-xs text-amber-700">
              Você ainda não definiu seus horários de atendimento. Alunos não conseguem agendar aulas enquanto sua agenda estiver vazia.
            </p>
          </div>
          <button
            onClick={() => router.push("/app/instructor/availability")}
            className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600 transition"
          >
            Configurar
          </button>
        </div>
      )}
      <InstructorSchedule
        classes={scheduledClasses}
        onGiveFeedback={giveFeedback}
        onCheckIn={checkIn}
        onCheckOut={checkOut}
        onNavigate={(screen) => {
          const path = SCREEN_TO_PATH[screen];
          if (path) router.push(path);
        }}
      />
    </div>
  );
}
