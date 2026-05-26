"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Filters {
  maxPrice: number;
  minRating: number;
  transmission: string;
  type: string;
}

export const FilterModal = ({ 
  isOpen, 
  onClose, 
  filters, 
  onApply 
}: { 
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onApply: (filters: Filters) => void;
}) => {
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  // Sincroniza os filtros locais quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const handleClear = () => {
    const reset = { maxPrice: 150, minRating: 0, transmission: 'Todos', type: 'Todos' };
    setLocalFilters(reset);
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const ratings = [0, 3, 3.5, 4, 4.5, 5];
  const transmissions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Manual', label: 'Manual' },
    { value: 'Automatic', label: 'Automático' }
  ];
  const types = ['Todos', 'Credenciado', 'Autônomo'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop Blur Premium */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Bottom Sheet Animada com Spring Physics */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="bg-white rounded-t-3xl p-5 pb-8 w-full max-w-md relative z-10 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Puxador Visual (Handle) */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full hover:bg-slate-350 transition-colors cursor-pointer" onClick={onClose} />
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <SlidersHorizontal size={16} />
                </div>
                <h3 className="text-lg font-black text-slate-800">Filtros de Busca</h3>
              </div>
              <button 
                onClick={onClose} 
                className="p-1.5 bg-slate-50 hover:bg-slate-100 active:scale-95 rounded-full text-slate-400 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Conteúdo dos Filtros */}
            <div className="space-y-6">
              {/* Preço Máximo */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Preço Máximo da Aula</label>
                  <span className="text-sm font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    Até R$ {localFilters.maxPrice}
                  </span>
                </div>
                <div className="pt-2">
                  <input 
                    type="range" 
                    min="40" 
                    max="150" 
                    step="5"
                    value={localFilters.maxPrice}
                    onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1.5">
                    <span>R$ 40</span>
                    <span>R$ 150</span>
                  </div>
                </div>
              </div>

              {/* Avaliação Mínima */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Avaliação Mínima</label>
                <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                  {ratings.map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setLocalFilters({ ...localFilters, minRating: rating })}
                      className={cn(
                        "py-2 px-1 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-0.5 cursor-pointer active:scale-[0.97]",
                        localFilters.minRating === rating
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                          : "bg-slate-50 text-slate-650 border-slate-100 hover:border-slate-200"
                      )}
                    >
                      {rating === 0 ? 'Todas' : (
                        <>
                          <Star size={10} className={cn(localFilters.minRating === rating ? "fill-white" : "fill-amber-400 text-amber-400")} />
                          {rating}+
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Câmbio (Transmissão) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Câmbio do Veículo</label>
                <div className="flex gap-2.5">
                  {transmissions.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setLocalFilters({ ...localFilters, transmission: t.value })}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-xs font-black border transition-all cursor-pointer active:scale-[0.97]",
                        localFilters.transmission === t.value
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                          : "bg-slate-50 text-slate-650 border-slate-100 hover:border-slate-200"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de Instrutor */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Regime do Instrutor</label>
                <div className="flex gap-2.5">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setLocalFilters({ ...localFilters, type: type })}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-xs font-black border transition-all cursor-pointer active:scale-[0.97]",
                        localFilters.type === type
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                          : "bg-slate-50 text-slate-650 border-slate-100 hover:border-slate-200"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ações Inferiores */}
            <div className="mt-8 flex gap-3">
              <button 
                onClick={handleClear}
                className="flex-1 py-3.5 bg-slate-55 border border-slate-200 text-slate-600 font-extrabold text-sm rounded-2xl hover:bg-slate-100 active:scale-[0.98] transition-all cursor-pointer"
              >
                Limpar
              </button>
              <button 
                onClick={handleApply}
                className="flex-2 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-extrabold text-sm rounded-2xl hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
              >
                Aplicar Filtros
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
