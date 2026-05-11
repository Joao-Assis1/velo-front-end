"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InstructorSettings } from "@/components/screens/instructor/Settings";

export default function InstructorSettingsPage() {
  const router = useRouter();
  return <InstructorSettings onBack={() => router.back()} />;
}
