"use client";

import React from 'react';
import { Filter, Star, Search, X } from 'lucide-react';
import { Button, Input } from '@/components/ui-custom';
import { InstructorFilter as FilterType } from '@/types';
import { cn } from '@/lib/utils';

interface InstructorFilterProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const InstructorFilter = ({ filters, onFilterChange, onClose, isModal }: InstructorFilterProps) => {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, maxPrice: Number(e.target.value) });
  };

  return (
    <div className={cn(
      "space-y-8",
      isModal ? "p-6" : ""
    )}>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Filter size={20} className="text-velo-blue" /> Filtros
        </h3>
        {isModal && (
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        )}
      </div>

      {/* Region Search */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Região</label>
        <Input 
          placeholder="Ex: Belo Horizonte, Centro..." 
          icon={<Search size={18} />} 
          value={filters.region || ''}
          onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
        />
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Preço Máximo</label>
          <span className="text-velo-blue font-black text-lg">R$ {filters.maxPrice || 150}</span>
        </div>
        <input 
          type="range" 
          min="50" 
          max="250" 
          step="5"
          value={filters.maxPrice || 150}
          onChange={handlePriceChange}
          className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-velo-blue"
        />
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
          <span>R$ 50</span>
          <span>R$ 250</span>
        </div>
      </div>

      {/* Transmission */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Transmissão</label>
        <div className="grid grid-cols-2 gap-2">
          {['Manual', 'Automático'].map((type) => (
            <button
              key={type}
              onClick={() => {
                const days = filters.days || [];
                // Reusing 'days' as a proxy for multi-select if needed, 
                // but for transmission let's just use a single value in types
                // Actually let's just stick to the type definition.
              }}
              className="py-3 px-4 rounded-xl border-2 border-slate-100 text-sm font-bold text-slate-600 hover:border-velo-blue/20 transition-all"
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-3">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Avaliação Mínima</label>
        <div className="flex gap-2">
          {[4, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              className="flex-1 py-2 rounded-xl border border-slate-100 flex items-center justify-center gap-1 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Star size={12} className="fill-yellow-400 text-yellow-400" /> {rating}+
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onFilterChange({})}
        >
          Limpar
        </Button>
        <Button className="flex-[2] bg-slate-900 text-white hover:bg-slate-800">
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
};
