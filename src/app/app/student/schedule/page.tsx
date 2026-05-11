"use client";

import React from "react";
import { StudentSchedule } from "@/components/screens/student/Schedule";
import { useApp } from "@/context/AppContext";

export default function StudentSchedulePage() {
  const { scheduledClasses, cancelClass, rateClass } = useApp();

  return (
    <StudentSchedule
      classes={scheduledClasses}
      onCancelClass={cancelClass}
      onRateClass={rateClass}
    />
  );
}
