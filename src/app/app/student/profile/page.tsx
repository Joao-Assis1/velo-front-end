"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { StudentProfile } from "@/components/screens/student/Profile";
import { useApp } from "@/context/AppContext";
import { ConfirmDialog } from "@/components/ui-custom/ConfirmDialog";

const SCREEN_TO_PATH: Record<string, string> = {
  "student-personal-data": "/app/student/profile/personal-data",
  "student-payments": "/app/student/payments",
  "student-settings": "/app/student/settings",
};

export default function StudentProfilePage() {
  const router = useRouter();
  const { studentProfile, logout } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="w-full">
      <StudentProfile
        profile={studentProfile}
        onNavigate={(screen) => {
          const path = SCREEN_TO_PATH[screen];
          if (path) router.push(path);
        }}
        onLogout={() => setConfirmOpen(true)}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Sair da conta"
        description="Tem certeza que deseja sair? Você precisará fazer login novamente."
        confirmLabel="Sair"
        cancelLabel="Cancelar"
        destructive
        onConfirm={() => { setConfirmOpen(false); logout(); router.push('/auth/login'); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
