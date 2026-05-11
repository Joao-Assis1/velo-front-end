"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InstructorFinance } from "@/components/screens/instructor/Finance";
import { useApp } from "@/context/AppContext";

export default function InstructorFinancePage() {
  const router = useRouter();
  const { scheduledClasses } = useApp();

  return (
    <InstructorFinance
      classes={scheduledClasses}
      onBack={() => router.back()}
    />
  );
}
