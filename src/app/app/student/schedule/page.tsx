"use client";

import React from "react";
import { StudentSchedule } from "@/components/screens/student/Schedule";
import { useApp } from "@/context/AppContext";

export default function StudentSchedulePage() {
  const { scheduledClasses, cancelClass, rateClass } = useApp();

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <StudentSchedule
        classes={scheduledClasses}
        onCancelClass={cancelClass}
        onRateClass={rateClass}
      />
    </div>
  );
}
