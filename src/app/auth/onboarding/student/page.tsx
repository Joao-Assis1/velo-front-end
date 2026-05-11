"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useApp } from "@/context/AppContext";

/**
 * After registration via AppContext.register(), the user is already logged in
 * and their profile is stored in context. This page just redirects to the
 * correct dashboard. It can be expanded later for KYC / LADV upload flows.
 */
export default function StudentOnboarding() {
  const router = useRouter();
  const { studentProfile, userRole } = useApp();

  useEffect(() => {
    if (userRole === "student") {
      router.replace("/app/student/dashboard");
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
