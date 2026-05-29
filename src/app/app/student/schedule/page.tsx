"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const StudentSchedule = dynamic(
  () => import("@/components/screens/student/Schedule").then((m) => ({ default: m.StudentSchedule })),
  { loading: () => <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-10 h-10 animate-spin text-velo-blue" /></div> },
);
import { useApp } from "@/context/AppContext";
import { useJourney } from "@/hooks/useJourney";
import { JourneyBlockerBanner } from "@/components/journey/JourneyBlockerBanner";

export default function StudentSchedulePage() {
  const { scheduledClasses, cancelClass, rateClass, refreshLessons } = useApp();

  useEffect(() => {
    refreshLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { data: journey } = useJourney();
  const blocked = journey && !journey.canScheduleLessons;

  return (
    <StudentSchedule
      classes={scheduledClasses}
      onCancelClass={cancelClass}
      onRateClass={rateClass}
      topBanner={blocked && journey ? <JourneyBlockerBanner blockers={journey.blockers} /> : undefined}
    />
  );
}
