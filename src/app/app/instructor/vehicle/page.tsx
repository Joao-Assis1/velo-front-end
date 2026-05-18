"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { InstructorVehicle } from "@/components/screens/instructor/Vehicle";
import { useApp } from "@/context/AppContext";
import { getInstructorByIdAction } from "@/lib/actions/instructors";
import { Instructor } from "@/types";

export default function InstructorVehiclePage() {
  const router = useRouter();
  const { instructorProfile, setInstructorProfile } = useApp();
  const [freshProfile, setFreshProfile] = useState<Instructor | null>(null);

  useEffect(() => {
    if (!instructorProfile?.id) return;
    getInstructorByIdAction(instructorProfile.id).then((res) => {
      if (res.success && res.data) {
        setFreshProfile(res.data as Instructor);
      } else {
        setFreshProfile(instructorProfile);
      }
    });
  }, [instructorProfile?.id]);

  if (!freshProfile) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <InstructorVehicle
        profile={freshProfile}
        onSave={(updated) => {
          setInstructorProfile(updated);
          router.back();
        }}
        onBack={() => router.back()}
      />
    </div>
  );
}
