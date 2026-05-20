"use client";

import React from "react";
import { Filter, Star, Search, X } from "lucide-react";
import { Button, Input } from "@/components/ui-custom";
import { InstructorFilter as FilterType } from "@/types";
import { cn } from "@/lib/utils";

interface InstructorFilterProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  onClose?: () => void;
  isModal?: boolean;
}

const TRANSMISSIONS: { label: string; value: "Manual" | "Automatic" }[] = [
  { label: "Manual", value: "Manual" },
  { label: "Automático", value: "Automatic" },
];

const RATINGS = [4, 4.5, 4.8];

export const InstructorFilter = ({
  filters,
  onFilterChange,
  onClose,
  isModal,
}: InstructorFilterProps) => {
  const handleApply = () => {
    onClose?.();
  };

  const handleClear = () => {
    onFilterChange({});
    onClose?.();
  };

  const toggleTransmission = (value: "Manual" | "Automatic") => {
    onFilterChange({
      ...filters,
      transmission: filters.transmission === value ? undefined : value,
    });
  };

  const toggleRating = (rating: number) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? undefined : rating,
    });
  };

  return (
    <div className={cn("space-y-8", isModal ? "p-6" : "")}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Filter size={20} className="text-velo-blue" /> Filtros
        </h3>
        {isModal && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        )}
      </div>

      {/* Region Search */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Região
        </label>
        <Input
          placeholder="Ex: Campo Grande, Centro..."
          icon={<Search size={18} />}
          value={filters.region || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, region: e.target.value })
          }
        />
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Preço Máximo
          </label>
          <span className="text-velo-blue font-black text-lg">
            R$ {filters.maxPrice || 150}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="250"
          step="5"
          value={filters.maxPrice || 150}
          onChange={(e) =>
            onFilterChange({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-velo-blue"
        />
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
          <span>R$ 50</span>
          <span>R$ 250</span>
        </div>
      </div>

      {/* Transmission */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Transmissão
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TRANSMISSIONS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => toggleTransmission(value)}
              className={cn(
                "py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all",
                filters.transmission === value
                  ? "border-velo-blue bg-velo-blue/5 text-velo-blue"
                  : "border-slate-100 text-slate-600 hover:border-velo-blue/20"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
          Avaliação Mínima
        </label>
        <div className="flex gap-2">
          {RATINGS.map((rating) => (
            <button
              key={rating}
              onClick={() => toggleRating(rating)}
              className={cn(
                "flex-1 py-2 rounded-xl border flex items-center justify-center gap-1 text-sm font-bold transition-all",
                filters.minRating === rating
                  ? "border-velo-blue bg-velo-blue/5 text-velo-blue"
                  : "border-slate-100 text-slate-600 hover:bg-slate-50"
              )}
            >
              <Star
                size={12}
                className={cn(
                  "fill-yellow-400",
                  filters.minRating === rating
                    ? "text-yellow-400"
                    : "text-yellow-400"
                )}
              />
              {rating}+
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={handleClear}>
          Limpar
        </Button>
        <Button
          className="flex-[2] bg-slate-900 text-white hover:bg-slate-800"
          onClick={handleApply}
        >
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};
