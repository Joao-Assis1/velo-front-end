"use client";

import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { Car, Camera, Check, Settings, ArrowLeft, Upload } from "lucide-react";
import { Button, Input } from "@/components/ui-custom";
import { Instructor } from "@/types";
import { cn } from "@/lib/utils";
import { updateInstructorVehicleAction } from "@/lib/actions/profileActions";
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
        const result = await updateInstructorVehicleAction(
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulação de upload transformando em URL local
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfile({
          ...localProfile,
          vehicleImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Meu Veículo</h1>
          <p className="text-slate-500 text-sm">
            Gerencie o veículo utilizado nas aulas
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-slate-100 shadow-md bg-slate-100 group">
            <img
              src={
                localProfile.vehicleImage ||
                "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop"
              }
              alt="Vehicle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 text-sm shadow-xl"
              >
                <Upload size={18} /> Alterar Foto
              </button>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-4 right-4 bg-velo-blue text-white p-3 rounded-full shadow-lg border-2 border-white"
            >
              <Camera size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Modelo do Veículo
            </label>
            <Input
              value={localProfile.vehicleModel}
              onChange={(e) =>
                setLocalProfile({
                  ...localProfile,
                  vehicleModel: e.target.value,
                })
              }
              icon={<Car size={18} />}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Placa
              </label>
              <Input
                value={localProfile.vehiclePlate || ""}
                onChange={(e) =>
                  setLocalProfile({
                    ...localProfile,
                    vehiclePlate: maskPlate(e.target.value),
                  })
                }
                placeholder="ABC-1234"
                className={cn(plateError && "border-red-500 focus:ring-red-200")}
              />
              {plateError && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                  Placa inválida. Use o formato AAA-0000 ou AAA-0A00.
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Ano
              </label>
              <Input
                value={localProfile.vehicleYear || ""}
                onChange={(e) =>
                  setLocalProfile({
                    ...localProfile,
                    vehicleYear: e.target.value,
                  })
                }
                placeholder="2023"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">
              Tipo de Câmbio
            </label>
            <div className="flex gap-4 p-1 bg-slate-100 rounded-xl">
              {[
                { id: "MANUAL", label: "Manual" },
                { id: "AUTO", label: "Automático" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    setLocalProfile({
                      ...localProfile,
                      transmission: t.id as any,
                    })
                  }
                  className={cn(
                    "flex-1 py-3 rounded-lg text-sm font-bold transition-all",
                    localProfile.transmission === t.id ||
                      (localProfile.transmission?.toString().toUpperCase() ===
                        "MANUAL" &&
                        t.id === "MANUAL") ||
                      (localProfile.transmission
                        ?.toString()
                        .toUpperCase()
                        .startsWith("AUTO") &&
                        t.id === "AUTO")
                      ? "bg-white text-velo-blue shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl flex gap-4 items-start border border-blue-100">
          <div className="bg-white p-2 rounded-full text-velo-blue shadow-sm shrink-0">
            <Settings size={20} />
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mantenha os dados do veículo sempre atualizados para que os alunos
            possam identificá-lo facilmente no momento da aula.
          </p>
        </div>

        <Button className="w-full py-4 text-lg" disabled={isSaved || isLoading}>
          {isLoading ? (
            "Salvando..."
          ) : isSaved ? (
            <>
              <Check size={20} /> Veículo Salvo
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </form>
    </div>
  );
};
