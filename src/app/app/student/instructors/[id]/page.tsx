"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const InstructorProfileView = dynamic(
  () => import("@/components/screens/student/InstructorProfile").then((m) => ({ default: m.InstructorProfileView })),
  { loading: () => <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-12 h-12 animate-spin text-velo-blue" /></div> },
);
import { getInstructorByIdAction } from "@/lib/actions/instructors";
import { useApp } from "@/context/AppContext";
import { Instructor } from "@/types";

export default function InstructorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { hasLadv, hasPaymentMethod, bookClass } = useApp();

  const { data: instructor, isLoading, isError } = useQuery({
    queryKey: ["instructor", id],
    queryFn: async () => {
      const res = await getInstructorByIdAction(id);
      if (!res.success || !res.data) throw new Error(res.error ?? "Instrutor não encontrado");
      return res.data as Instructor;
    },
  });

  useEffect(() => {
    if (isError) router.replace("/app/student/instructors");
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-velo-blue" />
        <p className="font-bold uppercase tracking-widest text-xs">Carregando perfil...</p>
      </div>
    );
  }

  if (!instructor) return null;

  const busySlots: Record<string, string[]> = {};
  for (const slot of instructor.busySlots ?? []) {
    const key = format(new Date(slot.date), "yyyy-MM-dd");
    const startHour = parseInt(slot.startTime.split(":")[0]);
    const endHour = parseInt(slot.endTime.split(":")[0]);
    if (!busySlots[key]) busySlots[key] = [];
    for (let h = startHour; h < endHour; h++) {
      busySlots[key].push(`${h.toString().padStart(2, "0")}:00`);
    }
  }

  const handleBookClass = async (
    date: Date,
    startTime: string,
    endTime: string,
    inst: Instructor,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await bookClass(date, startTime, endTime, inst);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message ?? "Erro ao agendar aula." };
    }
  };

  return (
    <div className="w-full">
      <InstructorProfileView
        instructor={instructor}
        onBack={() => router.back()}
        hasLadv={hasLadv}
        hasPaymentMethod={hasPaymentMethod}
        onUploadLadv={() => router.push("/app/student/ladv")}
        onAddPaymentMethod={() => router.push("/app/student/payments")}
        onBookClass={handleBookClass}
        busySlots={busySlots}
      />
    </div>
  );
}
