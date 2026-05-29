"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
  const { scheduledClasses, giveFeedback, checkIn, checkOut, refreshLessons } = useApp();

  useEffect(() => {
    refreshLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-4 md:px-8 py-6">
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
