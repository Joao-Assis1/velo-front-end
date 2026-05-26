"use client";

import React, { useEffect } from "react";
import { StudentSchedule } from "@/components/screens/student/Schedule";
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
