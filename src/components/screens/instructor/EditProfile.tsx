"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Camera,
  MapPin,
  User,
  FileText,
  Check,
  ArrowLeft,
  Calendar,
  Hash,
  Award,
  GraduationCap,
} from "lucide-react";
import { Button, Input } from "@/components/ui-custom";
import { Instructor } from "@/types";
import { maskCNH, maskRENACH } from "@/lib/utils/masks";

export const InstructorEditProfile = ({
  profile,
  onSave,
  onBack,
}: {
  profile: Instructor | null;
  onSave: (profile: Instructor) => void;
  onBack: () => void;
}) => {
  const [localProfile, setLocalProfile] = useState<Instructor>(
    profile || {
      id: "",
      email: "",
      name: "",
      profilePicture: "",
      vehicleImage: "",
      vehicleModel: "",
      rating: 0,
      reviewsCount: 0,
      pricePerClass: 0,
      location: "",
      bio: "",
      transmission: "Manual",
      instructorType: "Credenciado",
      vehiclePlate: "",
      vehicleYear: "",
      availability: [],
      busySlots: [],
    },
  );

  // Helper to format date for input type="date"
  const formatDateForInput = (date?: Date | string) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().split("T")[0];
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localProfile) {
      // Validação de idade mínima (25 anos) conforme Res. 1.020/25
      if (localProfile.birthDate) {
        const age = Math.floor((Date.now() - new Date(localProfile.birthDate).getTime()) / 31557600000);
        if (age < 25) {
          alert("O instrutor deve ter no mínimo 25 anos conforme Resolução CONTRAN 1.020/25.");
          return;
        }
      }

      setIsLoading(true);
      try {
        await onSave(localProfile);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } catch (error) {
        console.error("Erro ao salvar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Editar Perfil</h1>
          <p className="text-slate-500 text-sm">
            Informações públicas e profissionais (Res. 1.020/2025)
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
              <Camera size={16} aria-hidden="true" />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">CNH</label>
              <Input
                value={maskCNH(localProfile.cnhNumber || "")}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, cnhNumber: maskCNH(e.target.value) })
                }
                icon={<Hash size={18} />}
                maxLength={11}
                required
              />
            </div>
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
                  value={localProfile.cnhCategory || "B"}
                  onChange={(e) =>
                    setLocalProfile({ ...localProfile, cnhCategory: e.target.value })
                  }
                >
                  {["A", "B", "C", "D", "E", "AB", "AC", "AD", "AE"].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Tipo de Instrutor
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velo-blue/20 transition-colors text-sm text-slate-700"
                value={localProfile.instructorType || "Credenciado"}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, instructorType: e.target.value as any })
                }
              >
                <option value="Credenciado">Credenciado (CFC)</option>
                <option value="Autônomo">Autônomo (Res. 1.020/25)</option>
              </select>
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-slate-300 text-velo-blue focus-visible:ring-velo-blue"
                  checked={localProfile.cnhEar || false}
                  onChange={(e) =>
                    setLocalProfile({ ...localProfile, cnhEar: e.target.checked })
                  }
                />
                <span className="text-sm font-medium text-slate-700">Possui EAR</span>
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Registro RENACH (Instrutor)
            </label>
            <Input
              value={maskRENACH(localProfile.renachNumber || "")}
              onChange={(e) =>
                setLocalProfile({ ...localProfile, renachNumber: maskRENACH(e.target.value) })
              }
              icon={<Hash size={18} />}
              maxLength={11}
              required
            />
          </div>

          <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Declarações Obrigatórias
            </h3>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 rounded border-slate-300 text-velo-blue focus-visible:ring-velo-blue"
                checked={localProfile.certidaoNegativa || false}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, certidaoNegativa: e.target.checked })
                }
                required
              />
              <span className="text-xs text-slate-600 leading-tight">
                Declaro possuir as certidões negativas criminais e de débitos exigidas 
                pela Resolução 1.020/25 para o exercício da atividade.
              </span>
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Escolaridade
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <GraduationCap size={18} />
              </div>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velo-blue/20 transition-colors appearance-none text-sm text-slate-700"
                value={localProfile.educationLevel || "Ensino Médio"}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, educationLevel: e.target.value })
                }
              >
                <option value="Ensino Médio">Ensino Médio Completo</option>
                <option value="Superior Incompleto">Superior Incompleto</option>
                <option value="Superior Completo">Superior Completo</option>
                <option value="Pós-Graduação">Pós-Graduação</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Localização
            </label>
            <Input
              value={localProfile.location}
              onChange={(e) =>
                setLocalProfile({ ...localProfile, location: e.target.value })
              }
              icon={<MapPin size={18} />}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Bio / Descrição
            </label>
            <div className="relative">
              <div className="absolute left-3 top-3 text-slate-400">
                <FileText size={18} />
              </div>
              <textarea
                value={localProfile.bio}
                onChange={(e) =>
                  setLocalProfile({ ...localProfile, bio: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velo-blue/20 transition-colors min-h-[120px] text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Valor da Hora/Aula (R$)
            </label>
            <Input
              type="number"
              value={localProfile.pricePerClass || ""}
              onChange={(e) =>
                setLocalProfile({
                  ...localProfile,
                  pricePerClass: e.target.value === "" ? 0 : parseInt(e.target.value),
                })
              }
              icon={<span className="text-sm font-bold">R$</span>}
              required
            />
          </div>
        </div>

        <Button className="w-full py-4 text-lg" disabled={isSaved || isLoading}>
          {isLoading ? (
            "Salvando..."
          ) : isSaved ? (
            <>
              <Check size={20} /> Perfil Salvo
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </form>
    </div>
  );
};
