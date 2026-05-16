"use client";

import React from "react";
import { StudentSchedule } from "@/components/screens/student/Schedule";
import { useApp } from "@/context/AppContext";
import { useJourney } from "@/hooks/useJourney";
import { JourneyBlockerBanner } from "@/components/journey/JourneyBlockerBanner";

export default function StudentSchedulePage() {
  const { scheduledClasses, cancelClass, rateClass } = useApp();
  const { data: journey } = useJourney();
  const blocked = journey && !journey.canScheduleLessons;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 space-y-4">
      {blocked && journey && (
        <JourneyBlockerBanner blockers={journey.blockers} />
      )}
      <StudentSchedule
        classes={scheduledClasses}
        onCancelClass={cancelClass}
        onRateClass={rateClass}
      />
    </div>
  );
}
