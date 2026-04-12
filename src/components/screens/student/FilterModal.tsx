"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui-custom';
import { cn } from '@/lib/utils';

export const FilterModal = ({ 
  isOpen, 
  onClose, 
  filters, 
  onApply 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  filters: any, 
  onApply: (filters: any) => void 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-lg relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Filtros Avançados</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-8">
          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-900">Preço Máximo (R$)</label>
              <span className="text-velo-blue font-bold">Até R$ {localFilters.maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="40" 
              max="150" 
              step="5"
              value={localFilters.maxPrice}
              onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-velo-blue"
            />
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>R$ 40</span>
              <span>R$ 150</span>
            </div>
          </div>

          {/* Min Rating */}
          <div className="space-y-4">
            <label className="font-bold text-slate-900 block">Avaliação Mínima</label>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setLocalFilters({ ...localFilters, minRating: rating })}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-1",
                    localFilters.minRating === rating
                      ? "bg-slate-900 text-white border-slate-900 shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {rating === 0 ? 'Todas' : (
                    <>
                      <Star size={14} className={cn(localFilters.minRating === rating ? "fill-white" : "fill-yellow-400 text-yellow-400")} />
                      {rating}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div className="space-y-4">
            <label className="font-bold text-slate-900 block">Câmbio</label>
            <div className="flex gap-3">
              {['Todos', 'Manual', 'Automatic'].map((t) => (
                <button
                  key={t}
                  onClick={() => setLocalFilters({ ...localFilters, transmission: t })}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-bold border transition-all",
                    localFilters.transmission === t
                      ? "bg-velo-blue text-white border-velo-blue shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {t === 'Todos' ? 'Todos' : t === 'Manual' ? 'Manual' : 'Automático'}
                </button>
              ))}
            </div>
          </div>

          {/* Instructor Type */}
          <div className="space-y-4">
            <label className="font-bold text-slate-900 block">Tipo de Instrutor</label>
            <div className="flex gap-3">
              {['Todos', 'Credenciado', 'Autônomo'].map((type) => (
                <button
                  key={type}
                  onClick={() => setLocalFilters({ ...localFilters, type: type })}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-bold border transition-all",
                    localFilters.type === type
                      ? "bg-velo-green text-white border-velo-green shadow-md"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-3">
          <Button 
            variant="ghost" 
            className="flex-1" 
            onClick={() => {
              const reset = { maxPrice: 150, minRating: 0, transmission: 'Todos', type: 'Todos' };
              setLocalFilters(reset);
              onApply(reset);
            }}
          >
            Limpar
          </Button>
          <Button 
            className="flex-1" 
            onClick={() => {
              onApply(localFilters);
              onClose();
            }}
          >
            Aplicar Filtros
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
