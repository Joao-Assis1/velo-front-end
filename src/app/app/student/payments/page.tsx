"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const StudentPayments = dynamic(
  () =>
    import("@/components/screens/student/Payments").then((m) => ({
      default: m.StudentPayments,
    })),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    ),
  },
);

export default function PaymentsPage() {
  const router = useRouter();
  return <StudentPayments onBack={() => router.back()} />;
}
