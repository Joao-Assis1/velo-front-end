"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { StudentProfile } from "@/components/screens/student/Profile";
import { useApp } from "@/context/AppContext";

const SCREEN_TO_PATH: Record<string, string> = {
  "student-personal-data": "/app/student/profile/personal-data",
  "student-payments": "/app/student/payments",
  "student-settings": "/app/student/settings",
};

export default function StudentProfilePage() {
  const router = useRouter();
  const { studentProfile, logout } = useApp();

  return (
    <div className="px-4 md:px-8 py-6 max-w-3xl mx-auto">
      <StudentProfile
        profile={studentProfile}
        onNavigate={(screen) => {
          const path = SCREEN_TO_PATH[screen];
          if (path) router.push(path);
        }}
        onLogout={() => { if (window.confirm('Deseja realmente sair da conta?')) { logout(); router.push('/auth/login'); } }}
      />
    </div>
  );
}
