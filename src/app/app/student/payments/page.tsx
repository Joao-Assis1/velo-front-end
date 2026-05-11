"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { StudentPayments } from "@/components/screens/student/Payments";

export default function StudentPaymentsPage() {
  const router = useRouter();
  return <StudentPayments onBack={() => router.back()} />;
}
