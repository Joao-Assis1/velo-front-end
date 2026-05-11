"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InstructorSchedule } from "@/components/screens/instructor/Schedule";
import { useApp } from "@/context/AppContext";

const SCREEN_TO_PATH: Record<string, string> = {
  "instructor-availability": "/app/instructor/availability",
};

export default function InstructorSchedulePage() {
  const router = useRouter();
  const { scheduledClasses, giveFeedback, checkIn, checkOut } = useApp();

  return (
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
  );
}
