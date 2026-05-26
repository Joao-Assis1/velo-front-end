"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { StudentSettings } from "@/components/screens/student/Settings";

export default function StudentSettingsPage() {
  const router = useRouter();
  return (
    <div className="w-full">
      <StudentSettings onBack={() => router.back()} />
    </div>
  );
}
