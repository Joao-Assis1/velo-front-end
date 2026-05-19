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
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <InstructorProfileMenu
        profile={instructorProfile}
        onNavigate={(screen) => {
          const path = SCREEN_TO_PATH[screen];
          if (path) router.push(path);
        }}
        onLogout={() => { if (window.confirm('Deseja realmente sair da conta?')) { logout(); router.push('/auth/login'); } }}
      />
    </div>
  );
}
