"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { StudentPayments } from "@/components/screens/student/Payments";

export default function StudentPaymentsPage() {
  const router = useRouter();
  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
      <StudentPayments onBack={() => router.back()} />
    </div>
  );
}
