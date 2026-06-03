"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InstructorDashboard } from "@/components/screens/instructor/Dashboard";
import { useApp } from "@/context/AppContext";
import { getInstructorEarningsAction } from "@/lib/actions/instructors";

export default function InstructorDashboardPage() {
  const router = useRouter();
  const { instructorProfile, scheduledClasses, giveFeedback } = useApp();
  
  const [availableBalance, setAvailableBalance] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);

  useEffect(() => {
    if (instructorProfile?.id) {
      const now = new Date();
      getInstructorEarningsAction(instructorProfile.id, now.getMonth() + 1, now.getFullYear())
        .then((res) => {
          if (res.success && res.data) {
            setAvailableBalance(res.data.availableBalance * 0.8);
            const totalMonth = res.data.availableBalance + res.data.pendingBalance + res.data.transferredBalance;
            setMonthlyEarnings(totalMonth * 0.8);
          }
        });
    }
  }, [instructorProfile?.id]);

  return (
    <div className="px-4 md:px-8 py-6">
      <InstructorDashboard
        profile={instructorProfile}
        classes={scheduledClasses}
        onViewSchedule={() => router.push("/app/instructor/schedule")}
        onGiveFeedback={giveFeedback}
        onRegularize={() => router.push("/app/instructor/settings")}
        onRenew={() => router.push("/app/instructor/settings")}
        availableBalance={availableBalance}
        monthlyEarnings={monthlyEarnings}
      />
    </div>
  );
}
