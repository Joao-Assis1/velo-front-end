"use client";

import React, { useState, useRef } from "react";
import { Car, Camera, Check, ArrowLeft, Upload } from "lucide-react";
import { Button, Input } from "@/components/ui-custom";
import { Instructor } from "@/types";
import { cn } from "@/lib/utils";
import {
  updateInstructorVehicleAction,
  uploadVehiclePhotoAction,
} from "@/lib/actions/profileActions";
import { maskPlate, isValidPlate } from "@/lib/utils/masks";

export const InstructorVehicle = ({
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
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [plateError, setPlateError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localProfile.vehiclePlate && !isValidPlate(localProfile.vehiclePlate)) {
      setPlateError(true);
      return;
    }
    setPlateError(false);
    if (localProfile && localProfile.id) {
      try {
        setIsLoading(true);
        const result = await updateInstructorVehicleAction(localProfile.id, localProfile);
        if (result.success) {
          onSave(localProfile);
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        } else {
          console.error("Erro ao salvar:", result.error);
        }
      } catch (error) {
        console.error("Falha na requisição:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !localProfile.vehicleId) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalProfile({ ...localProfile, vehicleImage: reader.result as string });
    };
    reader.readAsDataURL(file);
    await uploadVehiclePhotoAction(localProfile.vehicleId, file);
  };

  return (
    <div className="pb-28 md:pb-10">

      {/* Hero strip */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 -mx-4 md:-mx-8 -mt-6 px-4 md:px-8 pt-6 pb-5 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <button
            onClick={onBack}
            aria-label="Voltar"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors mb-3 text-xs font-semibold"
          >
            <ArrowLeft size={15} /> Voltar
          </button>
          <h1 className="text-2xl font-black text-white tracking-tight">Meu Veículo</h1>
          <p className="text-slate-400 text-xs mt-0.5">Gerencie o veículo utilizado nas aulas</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Vehicle photo */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-sm">
            {localProfile.vehicleImage ? (
              <img src={localProfile.vehicleImage} alt="Veículo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                <Upload size={36} />
                <span className="text-sm font-medium text-slate-400">Adicionar foto do veículo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm shadow-xl"
              >
                <Upload size={16} /> Alterar Foto
              </button>
            </div>
            <button
              type="button"
              aria-label="Enviar foto do veículo"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 right-3 bg-blue-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white"
            >
              <Camera size={18} aria-hidden="true" />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Dados do veículo</p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Modelo</label>
              <Input
                value={localProfile.vehicleModel}
                onChange={(e) => setLocalProfile({ ...localProfile, vehicleModel: e.target.value })}
                icon={<Car size={16} />}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Placa</label>
                <Input
                  value={localProfile.vehiclePlate || ""}
                  onChange={(e) => setLocalProfile({ ...localProfile, vehiclePlate: maskPlate(e.target.value) })}
                  placeholder="ABC-1234"
                  className={cn(plateError && "border-red-500 focus-visible:ring-red-200")}
                />
                {plateError && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    Placa inválida. Use AAA-0000 ou AAA-0A00.
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ano</label>
                <Input
                  value={localProfile.vehicleYear || ""}
                  onChange={(e) => setLocalProfile({ ...localProfile, vehicleYear: e.target.value })}
                  placeholder="2023"
                />
              </div>
            </div>

            {/* Transmission toggle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Câmbio</label>
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
                {[{ id: "MANUAL", label: "Manual" }, { id: "AUTO", label: "Automático" }].map((t) => {
                  const isActive =
                    localProfile.transmission === t.id ||
                    (t.id === "MANUAL" && localProfile.transmission?.toString().toUpperCase() === "MANUAL") ||
                    (t.id === "AUTO" && localProfile.transmission?.toString().toUpperCase().startsWith("AUTO"));
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setLocalProfile({ ...localProfile, transmission: t.id as any })}
                      className={cn(
                        "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                        isActive ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Recursos de instrução (Res. 1.020/25)</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                checked={localProfile.hasDoubleCommand || false}
                onChange={(e) => setLocalProfile({ ...localProfile, hasDoubleCommand: e.target.checked })}
              />
              <span className="text-sm text-slate-700">
                Veículo possui <strong>Duplo Comando</strong> (Opcional p/ Autônomos)
              </span>
            </label>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 items-start border border-blue-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mantenha os dados do veículo sempre atualizados para que os alunos possam identificá-lo facilmente no momento da aula.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSaved || isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? "Salvando..." : isSaved ? <><Check size={18} /> Veículo Salvo</> : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
};
