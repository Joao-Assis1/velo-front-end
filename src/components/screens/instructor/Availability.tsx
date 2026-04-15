"use client";

import React, { useState } from "react";
import { ArrowLeft, Clock, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui-custom";
import { Instructor } from "@/types";
import { cn } from "@/lib/utils";
import { updateInstructorAvailabilityAction } from "@/lib/actions/profileActions";

const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export const InstructorAvailability = ({
  profile,
  onSave,
  onBack,
}: {
  profile: Instructor;
  onSave: (profile: Instructor) => void;
  onBack: () => void;
}) => {
  const [availability, setAvailability] = useState(() => {
    // Sempre garantir todos os 7 dias, mesclando com os dados salvos se existirem
    return DAYS_OF_WEEK.map((_, index) => {
      const savedDay = profile.availability?.find(
        (a) => a.dayOfWeek === index
      );
      return {
        dayOfWeek: index,
        startTime: savedDay?.startTime || "08:00",
        endTime: savedDay?.endTime || "18:00",
        isEnabled: savedDay ? savedDay.isEnabled : (index > 0 && index < 6),
      };
    });
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleDay = (dayOfWeek: number) => {
    setAvailability((prev) =>
      prev.map((a) =>
        a.dayOfWeek === dayOfWeek ? { ...a, isEnabled: !a.isEnabled } : a,
      ),
    );
  };

  const handleTimeChange = (
    dayOfWeek: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setAvailability((prev) =>
      prev.map((a) =>
        a.dayOfWeek === dayOfWeek ? { ...a, [field]: value } : a,
      ),
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await updateInstructorAvailabilityAction(
        profile.id,
        availability,
      );
      if (result.success) {
        onSave({ ...profile, availability });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        console.error("Erro ao salvar disponibilidade:", result.error);
      }
    } catch (error) {
      console.error("Falha ao salvar disponibilidade:", error);
    } finally {
      setIsLoading(false);
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
          <h1 className="text-2xl font-bold text-slate-900">Disponibilidade</h1>
          <p className="text-slate-500 text-sm">
            Defina seus horários de trabalho
          </p>
        </div>
      </header>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start mb-6">
        <AlertCircle size={20} className="text-velo-blue shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          Os horários ativados aqui ditarão a base na qual os alunos poderão
          agendar aulas de direção com você.
        </p>
      </div>

      <div className="space-y-4">
        {availability.map((day) => (
          <div
            key={day.dayOfWeek}
            className={cn(
              "p-4 rounded-2xl border transition-all",
              day.isEnabled
                ? "bg-white border-velo-blue shadow-sm"
                : "bg-slate-50 border-slate-200",
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleDay(day.dayOfWeek)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    day.isEnabled ? "bg-velo-blue" : "bg-slate-300",
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      day.isEnabled ? "right-1" : "left-1",
                    )}
                  />
                </button>
                <span
                  className={cn(
                    "font-bold text-sm",
                    day.isEnabled ? "text-slate-900" : "text-slate-400",
                  )}
                >
                  {DAYS_OF_WEEK[day.dayOfWeek]}
                </span>
              </div>
            </div>

            {day.isEnabled && (
              <div className="flex items-center gap-4 border-t border-slate-100 pt-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Clock size={12} /> Início
                  </label>
                  <input
                    type="time"
                    value={day.startTime}
                    onChange={(e) =>
                      handleTimeChange(
                        day.dayOfWeek,
                        "startTime",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-velo-blue focus:ring-1 focus:ring-velo-blue"
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Clock size={12} /> Fim
                  </label>
                  <input
                    type="time"
                    value={day.endTime}
                    onChange={(e) =>
                      handleTimeChange(day.dayOfWeek, "endTime", e.target.value)
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-velo-blue focus:ring-1 focus:ring-velo-blue"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        className="w-full py-4 text-lg mt-6"
        onClick={handleSubmit}
        disabled={isSaved || isLoading}
      >
        {isLoading ? (
          "Salvando..."
        ) : isSaved ? (
          <>
            <Check size={20} /> Salvo com Sucesso
          </>
        ) : (
          "Salvar Horários"
        )}
      </Button>
    </div>
  );
};
