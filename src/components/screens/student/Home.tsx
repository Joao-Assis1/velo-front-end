"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInstructorsAction } from '@/lib/actions/instructors';
import { FilterModal } from './FilterModal';
import { Instructor } from '@/types';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { useApp } from '@/context/AppContext';
import { LadvUpload } from '@/components/features/LadvUpload';

export const StudentHome = ({ onSelectInstructor }: { onSelectInstructor: (id: string) => void }) => {
  const { hasLadv } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLadvModalOpen, setIsLadvModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: 150,
    minRating: 0,
    transmission: 'Todos',
    type: 'Todos'
  });

  const { data: instructors = [], isLoading, error } = useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const response = await getInstructorsAction();
      if (!response.success) {
        throw new Error(response.error || 'Não foi possível carregar os instrutores.');
      }
      return response.data as Instructor[] || [];
    }
  });

  const instructorList = Array.isArray(instructors) ? instructors : [];

  const filteredInstructors = instructorList.filter(instructor => {
    if (!instructor) return false;
    const matchesSearch = (instructor.name?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) || 
                          (instructor.location?.toLowerCase() ?? "").includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if ((instructor.pricePerClass ?? 0) > filters.maxPrice) return false;
    if ((instructor.rating ?? 0) < filters.minRating) return false;
    if (filters.transmission !== 'Todos' && instructor.transmission !== filters.transmission) return false;
    if (filters.type !== 'Todos' && instructor.instructorType !== filters.type) return false;

    return true;
  });

  const activeFilterCount = (filters.maxPrice < 150 ? 1 : 0) + 
                            (filters.minRating > 0 ? 1 : 0) + 
                            (filters.transmission !== 'Todos' ? 1 : 0) + 
                            (filters.type !== 'Todos' ? 1 : 0);

  return (
    <div className="pb-24 pt-6 px-4 space-y-8 bg-white min-h-screen">
      <header className="flex justify-between items-center pt-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vamos dirigir<br/>hoje?</h1>
        <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
          <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </header>

      {!hasLadv && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex gap-3 items-start justify-between">
          <div className="flex gap-3 items-start">
            <AlertCircle className="text-orange-500 shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-orange-800 font-medium">Faça o upload da LADV para agendar suas aulas</p>
          </div>
          <button 
            onClick={() => setIsLadvModalOpen(true)}
            className="text-orange-600 font-bold text-sm underline shrink-0 transition-all active:scale-95"
          >
            Enviar agora
          </button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-velo-blue transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou local..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-velo-blue/10 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all relative",
              activeFilterCount > 0 
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            )}
          >
            <Filter size={24} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-velo-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {filters.maxPrice < 150 && (
              <span className="px-3 py-1.5 bg-blue-50 text-velo-blue text-xs font-bold rounded-full border border-blue-100 whitespace-nowrap">
                Até R$ {filters.maxPrice}
              </span>
            )}
            {filters.minRating > 0 && (
              <span className="px-3 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-100 flex items-center gap-1 whitespace-nowrap">
                <Star size={12} className="fill-yellow-400" /> {filters.minRating}+
              </span>
            )}
            {filters.transmission !== 'Todos' && (
              <span className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200 whitespace-nowrap">
                {filters.transmission === 'Manual' ? 'Manual' : 'Automático'}
              </span>
            )}
            {filters.type !== 'Todos' && (
              <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 whitespace-nowrap">
                {filters.type}
              </span>
            )}
            <button 
              onClick={() => setFilters({ maxPrice: 150, minRating: 0, transmission: 'Todos', type: 'Todos' })}
              className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              Limpar Tudo
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isFilterModalOpen && (
          <FilterModal 
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            filters={filters}
            onApply={setFilters}
          />
        )}
        {isLadvModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <LadvUpload 
                onClose={() => setIsLadvModalOpen(false)} 
                onSuccess={() => setIsLadvModalOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Instructors List */}
      <section className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-velo-blue" />
            <p className="font-medium">Buscando instrutores...</p>
          </div>
        ) : error ? (
          <EmptyState 
            icon={AlertCircle}
            title="Ops! Algo deu errado"
            description={(error as Error).message}
            action={
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-velo-blue text-white font-bold rounded-2xl shadow-lg shadow-velo-blue/20 active:scale-95 transition-all"
              >
                Tentar novamente
              </button>
            }
          />
        ) : filteredInstructors.length > 0 ? (
          filteredInstructors.map((instructor) => (
            <div 
              key={instructor.id} 
              className="group flex items-center gap-4 p-4 rounded-3xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer active:scale-[0.99]"
              onClick={() => onSelectInstructor(instructor.id)}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img src={instructor.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'} alt={instructor.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                  <div className="bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Star size={8} fill="currentColor" />
                    {instructor.rating}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-lg leading-tight truncate">{instructor.name}</h3>
                <p className="text-slate-500 text-sm truncate">{instructor.vehicleModel}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
                    {instructor.transmission}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">
                  R$ {instructor.pricePerClass}
                </p>
                <p className="text-xs text-slate-400 font-medium">/hora</p>
              </div>
            </div>
          ))
        ) : (
          <EmptyState 
            icon={Search}
            title="Nenhum instrutor encontrado"
            description="Tente mudar os filtros ou buscar por outra localização."
          />
        )}
      </section>
    </div>
  );
};

