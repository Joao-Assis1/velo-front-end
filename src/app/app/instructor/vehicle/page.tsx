"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InstructorVehicle } from "@/components/screens/instructor/Vehicle";
import { useApp } from "@/context/AppContext";

export default function InstructorVehiclePage() {
  const router = useRouter();
  const { instructorProfile, setInstructorProfile } = useApp();

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <InstructorVehicle
        profile={instructorProfile}
        onSave={(updated) => {
          setInstructorProfile(updated);
          router.back();
        }}
        onBack={() => router.back()}
      />
    </div>
  );
}
