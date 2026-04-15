"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Phone,
  Fingerprint,
  Camera,
  Check,
  ArrowLeft,
} from "lucide-react";
import { Button, Input } from "@/components/ui-custom";
import { Student } from "@/types";
import { updateStudentProfileAction } from "@/lib/actions/profileActions";

export const StudentPersonalData = ({
  profile,
  onSave,
  onBack,
}: {
  profile: Student | null;
  onSave: (profile: Student) => void;
  onBack: () => void;
}) => {
  const [localProfile, setLocalProfile] = useState<Student>(
    profile || {
      id: "",
      name: "",
      email: "",
      phone: "",
      cpf: "",
      profilePicture: "",
      ladvUploaded: false,
    },
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localProfile) {
      try {
        setIsLoading(true);
        const result = await updateStudentProfileAction(
          localProfile.id,
          localProfile,
        );

        if (result.success) {
          onSave(localProfile); // Sincroniza o estado com o componente pai
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        } else {
          console.error("Erro ao salvar no banco Neon:", result.error);
        }
      } catch (error) {
        console.error("Falha na requisição:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!profile && !localProfile.id)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-velo-blue"></div>
      </div>
    );

  return (
    <div className="pb-24 pt-6 px-4 space-y-6">
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dados Pessoais</h1>
          <p className="text-slate-500 text-sm">
            Mantenha seu perfil atualizado
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-md">
              <img
                src={
                  localProfile.profilePicture ||
                  "https://ui-avatars.com/api/?name=User"
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-velo-blue text-white p-2 rounded-full shadow-lg border-2 border-white"
            >
              <Camera size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Nome Completo
            </label>
            <Input
              value={localProfile.name}
              onChange={(e) =>
                setLocalProfile({ ...localProfile, name: e.target.value })
              }
              icon={<User size={18} />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              E-mail
            </label>
            <Input
              type="email"
              value={localProfile.email}
              onChange={(e) =>
                setLocalProfile({ ...localProfile, email: e.target.value })
              }
              icon={<Mail size={18} />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Celular / WhatsApp
            </label>
            <Input
              type="tel"
              value={localProfile.phone}
              onChange={(e) =>
                setLocalProfile({ ...localProfile, phone: e.target.value })
              }
              icon={<Phone size={18} />}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">CPF</label>
            <Input
              value={localProfile.cpf}
              onChange={(e) =>
                setLocalProfile({ ...localProfile, cpf: e.target.value })
              }
              icon={<Fingerprint size={18} />}
              disabled
              className="bg-slate-100 text-slate-500"
            />
          </div>
        </div>

        <Button className="w-full py-4 text-lg" disabled={isSaved || isLoading}>
          {isLoading ? (
            "Salvando..."
          ) : isSaved ? (
            <>
              <Check size={20} /> Salvo com Sucesso
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </form>
    </div>
  );
};
