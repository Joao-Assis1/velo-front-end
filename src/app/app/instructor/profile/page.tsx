"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InstructorProfileMenu } from "@/components/screens/instructor/ProfileMenu";
import { useApp } from "@/context/AppContext";

const SCREEN_TO_PATH: Record<string, string> = {
  "instructor-edit-profile": "/app/instructor/profile/edit",
  "instructor-vehicle": "/app/instructor/vehicle",
  "instructor-finance": "/app/instructor/finance",
  "instructor-settings": "/app/instructor/settings",
};

export default function InstructorProfilePage() {
  const router = useRouter();
  const { instructorProfile, logout } = useApp();

  return (
    <InstructorProfileMenu
      profile={instructorProfile}
      onNavigate={(screen) => {
        const path = SCREEN_TO_PATH[screen];
        if (path) router.push(path);
      }}
      onLogout={logout}
    />
  );
}
