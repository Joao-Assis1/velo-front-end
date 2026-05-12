"use client";

import React from "react";
import { StudentProgress } from "@/components/screens/student/Progress";
import { useApp } from "@/context/AppContext";

export default function ProgressPage() {
  const { scheduledClasses } = useApp();
  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <StudentProgress classes={scheduledClasses} />
    </div>
  );
}
