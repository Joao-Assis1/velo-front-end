"use client";

import React from "react";
import { StudentProgress } from "@/components/screens/student/Progress";
import { useApp } from "@/context/AppContext";

export default function ProgressPage() {
  const { scheduledClasses } = useApp();
  return <StudentProgress classes={scheduledClasses} />;
}
