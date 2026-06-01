"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StudentPersonalData } from "@/components/screens/student/PersonalData";
import { useApp } from "@/context/AppContext";
import { getStudentProfileAction } from "@/lib/actions/profileActions";
import { Student } from "@/types";

function parseBRDate(value: string): Date | undefined {
  const [day, month, year] = value.split("/");
  if (!day || !month || !year) return undefined;
  const d = new Date(`${year}-${month}-${day}`);
  return isNaN(d.getTime()) ? undefined : d;
}

function mapApiToStudent(data: any): Student {
  return {
    id: data.id,
    name: data.name ?? "",
    email: data.email ?? "",
    phone: data.phone ?? "",
    cpf: data.cpf ?? "",
    profilePicture: data.profilePicture ?? "",
    ladvUploaded: data.ladvUploaded ?? false,
    ladvValidationDate: data.ladv_validation_date ? parseBRDate(data.ladv_validation_date) : undefined,
    ladvDocumentUrl: data.ladv_document_url ?? undefined,
    birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    motherName: data.motherName ?? "",
    intendedCategory: data.intendedCategory ?? "B",
    ufDomicile: data.ufDomicile ?? "MS",
    paymentMethods: data.paymentMethods ?? [],
  };
}

export default function StudentPersonalDataPage() {
  const router = useRouter();
  const { studentProfile, setStudentProfile } = useApp();
  const [profile, setProfile] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentProfile?.id) {
      // context still hydrating — keep waiting
      return;
    }

    getStudentProfileAction(studentProfile.id).then((res) => {
      if (res.success && res.data) {
        setProfile(mapApiToStudent(res.data));
      } else {
        setError(res.error ?? "Erro ao carregar dados.");
        setProfile(studentProfile);
      }
      setLoading(false);
    });
  }, [studentProfile?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-velo-blue" />
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={() => router.push("/app/student/profile")}
          className="text-velo-blue text-sm font-semibold underline underline-offset-2"
        >
          Voltar ao perfil
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <StudentPersonalData
        profile={profile}
        onSave={(updated) => {
          setProfile(updated);
          setStudentProfile(updated);
          router.push("/app/student/profile");
        }}
        onBack={() => router.push("/app/student/profile")}
      />
    </div>
  );
}
