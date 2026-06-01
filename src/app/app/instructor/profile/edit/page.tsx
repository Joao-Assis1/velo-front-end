"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { InstructorEditProfile } from "@/components/screens/instructor/EditProfile";
import { useApp } from "@/context/AppContext";
import { getInstructorByIdAction } from "@/lib/actions/instructors";

export default function InstructorEditProfilePage() {
  const router = useRouter();
  const { instructorProfile, setInstructorProfile, updateInstructorProfile } = useApp();

  useEffect(() => {
    if (!instructorProfile?.id) return;
    getInstructorByIdAction(instructorProfile.id).then((res) => {
      if (res.success && res.data) setInstructorProfile(res.data);
    });
  }, [instructorProfile?.id]);

  return (
    <div className="px-4 md:px-8 py-6">
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
