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
  Calendar,
  Heart,
  Award,
  MapPin,
} from "lucide-react";
import { Button, Input } from "@/components/ui-custom";
import { Student } from "@/types";
import { updateStudentProfileAction } from "@/lib/actions/profileActions";
import { maskCPF, maskPhone } from "@/lib/utils/masks";

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

  // Helper to format date for input type="date"
  const formatDateForInput = (date?: Date | string) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
  };

  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localProfile) {
      try {
        setIsLoading(true);
        const result = await updateStudentProfileAction(
          localProfile.id || "",
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
    <div className="pb-28 md:pb-10 space-y-6">
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          aria-label="Voltar"
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dados Pessoais</h1>
          <p className="text-slate-500 text-sm">
            Mantenha seu perfil atualizado (Res. 1.020/2025)
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-md">
              {localProfile.profilePicture ? (
                <img src={localProfile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 font-bold text-2xl">
                  {localProfile.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            <button
              type="button"
              aria-label="Alterar foto de perfil"
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
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Data de Nascimento
              </label>
              <Input
                type="date"
                value={formatDateForInput(localProfile.birthDate)}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, birthDate: new Date(e.target.value) })
                }
                icon={<Calendar size={18} />}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">CPF</label>
              <Input
                value={maskCPF(localProfile.cpf || "")}
                icon={<Fingerprint size={18} />}
                disabled
                className="bg-slate-100 text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Nome da Mãe
            </label>
            <Input
              value={localProfile.motherName || ""}
              onChange={(e) =>
                setLocalProfile({ ...localProfile, motherName: e.target.value })
              }
              icon={<Heart size={18} />}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Categoria
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Award size={18} />
                </div>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velo-blue/20 transition-colors appearance-none text-sm text-slate-700"
                  value={localProfile.intendedCategory || "B"}
                  onChange={(e) =>
                    setLocalProfile({ ...localProfile, intendedCategory: e.target.value as any })
                  }
                >
                  <option value="A">Cat. A</option>
                  <option value="B">Cat. B</option>
                  <option value="ACC">ACC</option>
                  <option value="AB">Cat. AB</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                UF Domicílio
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <MapPin size={18} />
                </div>
                <select
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velo-blue/20 transition-colors appearance-none text-sm text-slate-700"
                  value={localProfile.ufDomicile || "SP"}
                  onChange={(e) =>
                    setLocalProfile({ ...localProfile, ufDomicile: e.target.value })
                  }
                >
                  {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>
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
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Celular / WhatsApp
            </label>
            <Input
              type="tel"
              value={maskPhone(localProfile.phone || "")}
              onChange={(e) =>
                setLocalProfile({ ...localProfile, phone: maskPhone(e.target.value) })
              }
              icon={<Phone size={18} />}
              required
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
