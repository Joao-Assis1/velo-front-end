"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InstructorEditProfile } from "@/components/screens/instructor/EditProfile";
import { useApp } from "@/context/AppContext";

export default function InstructorEditProfilePage() {
  const router = useRouter();
  const { instructorProfile, setInstructorProfile, updateInstructorProfile } = useApp();

  return (
    <InstructorEditProfile
      profile={instructorProfile}
      onSave={async (updated) => {
        await updateInstructorProfile(updated);
        setInstructorProfile(updated);
        router.back();
      }}
      onBack={() => router.back()}
    />
  );
}
