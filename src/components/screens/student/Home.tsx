"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, Loader2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInstructorsAction } from '@/lib/actions/instructors';
import { FilterModal } from './FilterModal';
import { Instructor } from '@/types';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { useApp } from '@/context/AppContext';
import { LadvUpload } from '@/components/features/LadvUpload';

export const StudentHome = ({ onSelectInstructor }: { onSelectInstructor: (id: string) => void }) => {
  const { hasLadv, studentProfile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLadvModalOpen, setIsLadvModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: 150,
    minRating: 0,
    transmission: 'Todos',
    type: 'Todos',
  });

  const { data: instructors = [], isLoading, error } = useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const response = await getInstructorsAction();
      if (!response.success) throw new Error(response.error || 'Não foi possível carregar os instrutores.');
      return response.data as Instructor[] || [];
    },
  });

  const instructorList = Array.isArray(instructors) ? instructors : [];

  const filteredInstructors = instructorList.filter((instructor) => {
    if (!instructor) return false;
    const matchesSearch =
      (instructor.name?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
      (instructor.location?.toLowerCase() ?? '').includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if ((instructor.pricePerClass ?? 0) > filters.maxPrice) return false;
    if ((instructor.rating ?? 0) < filters.minRating) return false;
    if (filters.transmission !== 'Todos' && instructor.transmission !== filters.transmission) return false;
    if (filters.type !== 'Todos' && instructor.instructorType !== filters.type) return false;
    return true;
  });

  const activeFilterCount =
    (filters.maxPrice < 150 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.transmission !== 'Todos' ? 1 : 0) +
    (filters.type !== 'Todos' ? 1 : 0);

  return (
    <div className="pb-28 md:pb-10 space-y-6">

      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-slate-400">
            Encontre seu instrutor
          </p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Vamos dirigir hoje?
          </h1>
        </div>
        <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden ring-2 ring-white shadow-sm shrink-0 flex items-center justify-center">
          {studentProfile?.profilePicture ? (
            <img src={studentProfile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-500 font-bold text-sm">
              {studentProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </div>
      </header>

      {/* LADV Alert */}
      {!hasLadv && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex gap-3 items-center justify-between">
          <div className="flex gap-3 items-center min-w-0">
            <AlertCircle className="text-orange-500 shrink-0" size={18} />
            <p className="text-sm text-orange-800 font-medium truncate">
              Faça o upload da LADV para agendar suas aulas
            </p>
          </div>
          <button
            onClick={() => setIsLadvModalOpen(true)}
            className="text-orange-600 font-bold text-sm underline underline-offset-2 shrink-0 hover:text-orange-700 transition-colors"
          >
            Enviar agora
          </button>
        </div>
      )}

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-velo-blue transition-colors"
            />
            <input
              type="text"
              placeholder="Buscar por nome ou localização..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-velo-blue/15 focus:border-velo-blue/50 transition-colors text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Limpar busca"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            aria-label="Abrir filtros"
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center transition-colors relative shrink-0',
              activeFilterCount > 0
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
            )}
          >
            <Filter size={18} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-velo-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex gap-2 flex-wrap">
            {filters.maxPrice < 150 && (
              <span className="px-3 py-1 bg-blue-50 text-velo-blue text-xs font-bold rounded-full border border-blue-100">
                Até R$ {filters.maxPrice}
              </span>
            )}
            {filters.minRating > 0 && (
              <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-bold rounded-full border border-yellow-100 flex items-center gap-1">
                <Star size={11} className="fill-yellow-400" /> {filters.minRating}+
              </span>
            )}
            {filters.transmission !== 'Todos' && (
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                {filters.transmission === 'Manual' ? 'Manual' : 'Automático'}
              </span>
            )}
            {filters.type !== 'Todos' && (
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
                {filters.type}
              </span>
            )}
            <button
              onClick={() => setFilters({ maxPrice: 150, minRating: 0, transmission: 'Todos', type: 'Todos' })}
              className="px-3 py-1 text-xs font-bold text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              Limpar tudo
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      {!isLoading && !error && (
        <p className="text-xs text-slate-400 font-medium -mt-2">
          {filteredInstructors.length} instrutor{filteredInstructors.length !== 1 ? 'es' : ''} encontrado{filteredInstructors.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Modals */}
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
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <LadvUpload
                onClose={() => setIsLadvModalOpen(false)}
                onSuccess={() => setIsLadvModalOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Instructor Grid */}
      <section>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-velo-blue" />
            <p className="text-sm font-medium">Buscando instrutores...</p>
          </div>
        ) : error ? (
          <EmptyState
            icon={AlertCircle}
            title="Ops! Algo deu errado"
            description={(error as Error).message}
            action={
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-velo-blue text-white text-sm font-bold rounded-xl shadow-md shadow-velo-blue/20 hover:bg-velo-blue-dark transition-colors"
              >
                Tentar novamente
              </button>
            }
          />
        ) : filteredInstructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredInstructors.map((instructor) => (
              <button
                key={instructor.id}
                type="button"
                onClick={() => onSelectInstructor(instructor.id)}
                className="group text-left flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/60 transition-colors duration-200 active:scale-[0.99]"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-100 flex items-center justify-center">
                    {instructor.profilePicture ? (
                      <img
                        src={instructor.profilePicture}
                        alt={instructor.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-slate-500 font-bold text-lg">
                        {instructor.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                    <Star size={8} fill="currentColor" />
                    {instructor.rating}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                    {instructor.name}
                  </h3>
                  <p className="text-slate-400 text-xs truncate mt-0.5">{instructor.vehicleModel}</p>
                  <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md mt-1.5">
                    {instructor.transmission}
                  </span>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-slate-900 tabular-nums">
                    R$ {instructor.pricePerClass}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">/hora</p>
                </div>
              </button>
            ))}
          </div>
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
