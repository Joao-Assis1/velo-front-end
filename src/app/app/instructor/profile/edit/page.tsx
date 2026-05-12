"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InstructorEditProfile } from "@/components/screens/instructor/EditProfile";
import { useApp } from "@/context/AppContext";

export default function InstructorEditProfilePage() {
  const router = useRouter();
  const { instructorProfile, setInstructorProfile, updateInstructorProfile } = useApp();

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <InstructorEditProfile
        profile={instructorProfile}
        onSave={async (updated) => {
          await updateInstructorProfile(updated);
          setInstructorProfile(updated);
          router.back();
        }}
        onBack={() => router.back()}
      />
    </div>
  );
}
