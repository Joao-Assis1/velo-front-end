"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Mail,
  Phone,
  Fingerprint,
  Check,
  ChevronLeft,
  Calendar,
  Heart,
  Award,
  MapPin,
} from "lucide-react";
import { AvatarUploader } from "@/components/ui-custom/AvatarUploader";
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
    <div className="min-h-screen bg-slate-50">
      {/* Dark header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/8 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="max-w-2xl mx-auto w-full px-4 md:px-6 pt-5 pb-6 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-white/15 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <p className="text-xs font-bold tracking-widest uppercase text-blue-400">Perfil</p>
          </div>
          {/* Avatar uploader centralizado no header */}
          <div className="flex justify-center">
            <AvatarUploader
              currentImage={localProfile.profilePicture}
              name={localProfile.name}
              onImage={(base64) =>
                setLocalProfile({ ...localProfile, profilePicture: base64 })
              }
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full px-4 pb-28 md:pb-12 pt-6 space-y-3">
        {/* Nome Completo */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <User size={11} />
            Nome Completo
          </label>
          <input
            type="text"
            value={localProfile.name || ""}
            placeholder="Seu nome completo"
            onChange={(e) =>
              setLocalProfile({ ...localProfile, name: e.target.value })
            }
            className="w-full text-sm font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 placeholder:font-normal"
            required
          />
        </div>

        {/* E-mail */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Mail size={11} />
            E-mail
          </label>
          <input
            type="email"
            value={localProfile.email || ""}
            placeholder="seu@email.com"
            onChange={(e) =>
              setLocalProfile({ ...localProfile, email: e.target.value })
            }
            className="w-full text-sm font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 placeholder:font-normal"
            required
          />
        </div>

        {/* Celular / WhatsApp */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Phone size={11} />
            Celular / WhatsApp
          </label>
          <input
            type="tel"
            value={maskPhone(localProfile.phone || "")}
            placeholder="(11) 90000-0000"
            onChange={(e) =>
              setLocalProfile({ ...localProfile, phone: maskPhone(e.target.value) })
            }
            className="w-full text-sm font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 placeholder:font-normal"
            required
          />
        </div>

        {/* CPF (Disabled) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-3 opacity-75">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Fingerprint size={11} />
            CPF (Não editável)
          </label>
          <input
            type="text"
            value={maskCPF(localProfile.cpf || "")}
            className="w-full text-sm font-semibold text-slate-500 bg-transparent outline-none cursor-not-allowed"
            disabled
          />
        </div>

        {/* Data de Nascimento */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Calendar size={11} />
            Data de Nascimento
          </label>
          <input
            type="date"
            value={formatDateForInput(localProfile.birthDate)}
            onChange={(e) =>
              setLocalProfile({ ...localProfile, birthDate: new Date(e.target.value) })
            }
            className="w-full text-sm font-semibold text-slate-900 bg-transparent outline-none cursor-pointer"
            required
          />
        </div>

        {/* Nome da Mãe */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Heart size={11} />
            Nome da Mãe
          </label>
          <input
            type="text"
            value={localProfile.motherName || ""}
            placeholder="Nome completo da mãe"
            onChange={(e) =>
              setLocalProfile({ ...localProfile, motherName: e.target.value })
            }
            className="w-full text-sm font-semibold text-slate-900 bg-transparent outline-none placeholder:text-slate-300 placeholder:font-normal"
            required
          />
        </div>

        {/* Categoria Select Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-3 opacity-75">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <Award size={11} />
            Categoria pretendida
          </label>
          <p className="text-sm font-semibold text-slate-500 cursor-not-allowed">Categoria B</p>
        </div>

        {/* UF Domicílio Select Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
            <MapPin size={11} />
            UF de Domicílio
          </label>
          <select
            value={localProfile.ufDomicile || "MS"}
            onChange={(e) =>
              setLocalProfile({ ...localProfile, ufDomicile: e.target.value })
            }
            className="w-full text-sm font-semibold text-slate-900 bg-transparent outline-none appearance-none cursor-pointer"
          >
            {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>

        {/* Botão salvar */}
        <button
          type="submit"
          disabled={isSaved || isLoading}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-extrabold rounded-2xl hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-blue-600/20 mt-2 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            "Salvando..."
          ) : isSaved ? (
            <>
              <Check size={18} /> Salvo com sucesso!
            </>
          ) : (
            "Salvar alterações"
          )}
        </button>
      </form>
    </div>
  );
};
