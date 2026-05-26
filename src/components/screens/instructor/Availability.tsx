"use client";

import React, { useState } from "react";
import { ArrowLeft, Clock, Check } from "lucide-react";
import { Instructor } from "@/types";
import { cn } from "@/lib/utils";
import { updateInstructorAvailabilityAction } from "@/lib/actions/profileActions";

const DAYS_OF_WEEK = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const DAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const InstructorAvailability = ({
  profile,
  onSave,
  onBack,
}: {
  profile: Instructor;
  onSave: (profile: Instructor) => void;
  onBack: () => void;
}) => {
  const [availability, setAvailability] = useState(() =>
    DAYS_OF_WEEK.map((_, index) => {
      const savedDay = profile.availability?.find((a) => a.dayOfWeek === index);
      return {
        dayOfWeek: index,
        startTime: savedDay?.startTime || "08:00",
        endTime: savedDay?.endTime || "18:00",
        isEnabled: savedDay ? savedDay.isEnabled : index > 0 && index < 6,
      };
    })
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleDay = (dayOfWeek: number) => {
    setAvailability((prev) =>
      prev.map((a) => (a.dayOfWeek === dayOfWeek ? { ...a, isEnabled: !a.isEnabled } : a))
    );
  };

  const handleTimeChange = (dayOfWeek: number, field: "startTime" | "endTime", value: string) => {
    setAvailability((prev) =>
      prev.map((a) => (a.dayOfWeek === dayOfWeek ? { ...a, [field]: value } : a))
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await updateInstructorAvailabilityAction(profile.id, availability);
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

  const enabledCount = availability.filter((a) => a.isEnabled).length;

  return (
    <div className="pb-28 md:pb-10">

      {/* Hero strip */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 -mx-4 md:-mx-8 -mt-6 px-4 md:px-8 pt-6 pb-5 relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors mb-3 text-xs font-semibold"
          >
            <ArrowLeft size={15} /> Voltar
          </button>
          <h1 className="text-2xl font-black text-white tracking-tight">Disponibilidade</h1>
          <p className="text-slate-400 text-xs mt-0.5">
            {enabledCount} dia{enabledCount !== 1 ? 's' : ''} ativo{enabledCount !== 1 ? 's' : ''} · defina seus horários de trabalho
          </p>
        </div>
      </div>

      <div className="space-y-6">

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="text-xs text-slate-600 leading-relaxed">
            Os horários ativados aqui ditarão a base na qual os alunos poderão agendar aulas de direção com você.
          </p>
        </div>

        <div className="space-y-3">
          {availability.map((day) => (
            <div
              key={day.dayOfWeek}
              className={cn(
                "bg-white border rounded-2xl overflow-hidden transition-all shadow-sm",
                day.isEnabled ? "border-blue-200" : "border-slate-100"
              )}
            >
              <div className={cn(
                "flex items-center justify-between px-4 py-3.5",
                day.isEnabled ? "border-b border-blue-100" : ""
              )}>
                <span className={cn(
                  "font-semibold text-sm",
                  day.isEnabled ? "text-slate-900" : "text-slate-400"
                )}>
                  {DAYS_OF_WEEK[day.dayOfWeek]}
                </span>
                <button
                  onClick={() => handleToggleDay(day.dayOfWeek)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors relative shrink-0",
                    day.isEnabled ? "bg-blue-600" : "bg-slate-200"
                  )}
                  aria-label={`${day.isEnabled ? 'Desativar' : 'Ativar'} ${DAYS_OF_WEEK[day.dayOfWeek]}`}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                    day.isEnabled ? "right-1" : "left-1"
                  )} />
                </button>
              </div>

              {day.isEnabled && (
                <div className="flex items-center gap-4 px-4 py-3 bg-blue-50/40">
                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Clock size={9} /> Início
                    </label>
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => handleTimeChange(day.dayOfWeek, "startTime", e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <Clock size={9} /> Fim
                    </label>
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => handleTimeChange(day.dayOfWeek, "endTime", e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaved || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? "Salvando..." : isSaved ? <><Check size={18} /> Salvo com Sucesso</> : "Salvar Horários"}
        </button>
      </div>
    </div>
  );
};
