"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { StudentSettings } from "@/components/screens/student/Settings";

export default function StudentSettingsPage() {
  const router = useRouter();
  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <StudentSettings onBack={() => router.back()} />
    </div>
  );
}
