"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "@/context/AppContext";

/**
 * After registration via AppContext.register(), the instructor is already
 * logged in and their profile is stored in context. This page redirects to
 * the instructor dashboard. Additional credential validation steps can be
 * added here as part of Fase 1 (CONTRAN 1.020/2025 compliance).
 */
export default function InstructorOnboarding() {
  const router = useRouter();
  const { userRole } = useApp();

  useEffect(() => {
    if (userRole === "instructor") {
      router.replace("/app/instructor/dashboard");
    } else {
      router.replace("/");
    }
  }, [userRole, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-500 text-sm animate-pulse">Redirecionando…</p>
    </div>
  );
}
