"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InstructorFinance } from "@/components/screens/instructor/Finance";
import { useApp } from "@/context/AppContext";

export default function InstructorFinancePage() {
  const router = useRouter();
  const { scheduledClasses, instructorProfile } = useApp();

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <InstructorFinance
        classes={scheduledClasses}
        pixKey={instructorProfile?.pixKey}
        onBack={() => router.back()}
      />
    </div>
  );
}
