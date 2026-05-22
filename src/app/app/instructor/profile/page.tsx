"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { InstructorProfileMenu } from "@/components/screens/instructor/ProfileMenu";
import { useApp } from "@/context/AppContext";
import { ConfirmDialog } from "@/components/ui-custom/ConfirmDialog";

const SCREEN_TO_PATH: Record<string, string> = {
  "instructor-edit-profile": "/app/instructor/profile/edit",
  "instructor-vehicle": "/app/instructor/vehicle",
  "instructor-finance": "/app/instructor/finance",
  "instructor-settings": "/app/instructor/settings",
};

export default function InstructorProfilePage() {
  const router = useRouter();
  const { instructorProfile, logout } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="px-4 md:px-8 py-6">
      <InstructorProfileMenu
        profile={instructorProfile}
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
