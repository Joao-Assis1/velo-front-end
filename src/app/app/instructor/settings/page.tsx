"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InstructorSettings } from "@/components/screens/instructor/Settings";

export default function InstructorSettingsPage() {
  const router = useRouter();
  return (
    <div className="px-4 md:px-8 py-6">
      <InstructorSettings onBack={() => router.back()} />
    </div>
  );
}
