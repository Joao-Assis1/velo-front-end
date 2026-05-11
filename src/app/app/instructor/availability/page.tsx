"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InstructorAvailability } from "@/components/screens/instructor/Availability";
import { useApp } from "@/context/AppContext";

export default function InstructorAvailabilityPage() {
  const router = useRouter();
  const { instructorProfile, setInstructorProfile } = useApp();

  if (!instructorProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <InstructorAvailability
      profile={instructorProfile}
      onSave={(updated) => {
        setInstructorProfile(updated);
        router.back();
      }}
      onBack={() => router.back()}
    />
  );
}
