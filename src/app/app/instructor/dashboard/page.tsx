"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InstructorDashboard } from "@/components/screens/instructor/Dashboard";
import { useApp } from "@/context/AppContext";

export default function InstructorDashboardPage() {
  const router = useRouter();
  const { instructorProfile, scheduledClasses, giveFeedback } = useApp();

  return (
    <InstructorDashboard
      profile={instructorProfile}
      classes={scheduledClasses}
      onViewSchedule={() => router.push("/app/instructor/schedule")}
      onGiveFeedback={giveFeedback}
      onRegularize={() => router.push("/app/instructor/settings")}
      onRenew={() => router.push("/app/instructor/settings")}
    />
  );
}
