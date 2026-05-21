"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star, Loader2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getInstructorsAction } from '@/lib/actions/instructors';
import Link from 'next/link';
import { FilterModal } from './FilterModal';
import { Instructor } from '@/types';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { useApp } from '@/context/AppContext';

export const StudentHome = ({ onSelectInstructor }: { onSelectInstructor: (id: string) => void }) => {
  const { hasLadv, studentProfile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: 150,
    minRating: 0,
    transmission: 'Todos',
    type: 'Todos',
  });

  const { data: instructors = [], isLoading, error } = useQuery({
    queryKey: ['instructors', filters],
    queryFn: async () => {
      const response = await getInstructorsAction(filters);
      if (!response.success) throw new Error(response.error || 'Não foi possível carregar os instrutores.');
      return response.data as Instructor[] || [];
    },
  });

  const instructorList = Array.isArray(instructors) ? instructors : [];

  const filteredInstructors = instructorList.filter((instructor) => {
    if (!instructor) return false;
    if (!searchQuery) return true;
    
    return (
      (instructor.name?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
      (instructor.location?.toLowerCase() ?? '').includes(searchQuery.toLowerCase())
    );
  });

  const activeFilterCount =
    (filters.maxPrice < 150 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.transmission !== 'Todos' ? 1 : 0) +
    (filters.type !== 'Todos' ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark header com search integrado */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 pt-6 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-blue-400">Encontre seu instrutor</p>
              <h1 className="text-xl font-extrabold text-slate-50 mt-0.5">Vamos dirigir hoje?</h1>
            </div>
            <div className="w-9 h-9 bg-white/10 rounded-xl overflow-hidden border border-white/10 shrink-0 flex items-center justify-center">
              {studentProfile?.profilePicture ? (
                <img src={studentProfile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">
                  {studentProfile?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              )}
            </div>
          </div>

          {/* Search + filter button no header */}
          <div className="flex gap-2">
            <div className="relative flex-1 group">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Buscar por nome ou região..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-xl py-2.5 pl-10 pr-9 text-slate-100 text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white/15 focus:border-white/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpar busca"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsFilterModalOpen(true)}
              aria-label="Abrir filtros"
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 relative cursor-pointer',
                activeFilterCount > 0
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white/10 border border-white/10 text-white hover:bg-white/15'
              )}
            >
              <Filter size={16} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-white text-blue-600 text-[9px] font-black rounded-full flex items-center justify-center border-2 border-slate-900">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Contêiner Geral Alinhado para o Conteúdo da Página */}
      <div className="max-w-6xl mx-auto w-full px-4 md:px-6 pb-28 md:pb-12 pt-4">
        {/* LADV alert */}
        {!hasLadv && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-3 flex gap-3 items-center justify-between shadow-sm">
            <div className="flex gap-2.5 items-center min-w-0">
              <AlertCircle className="text-amber-500 shrink-0" size={16} />
              <p className="text-xs text-amber-800 font-semibold truncate">LADV pendente — envie para agendar aulas</p>
            </div>
            <Link href="/app/student/ladv" className="text-amber-600 font-bold text-xs shrink-0 underline underline-offset-2 hover:text-amber-700 transition-colors">
              Enviar ›
            </Link>
          </div>
        )}

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {filters.maxPrice < 150 && (
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                Até R$ {filters.maxPrice}
              </span>
            )}
            {filters.minRating > 0 && (
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100 flex items-center gap-1">
                <Star size={11} className="fill-amber-400 text-amber-400" /> {filters.minRating}+
              </span>
            )}
            {filters.transmission !== 'Todos' && (
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                {filters.transmission}
              </span>
            )}
            {filters.type !== 'Todos' && (
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                {filters.type}
              </span>
            )}
            <button
              onClick={() => setFilters({ maxPrice: 150, minRating: 0, transmission: 'Todos', type: 'Todos' })}
              className="px-3 py-1 text-xs font-bold text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
            >
              Limpar
            </button>
          </div>
        )}

        {/* Results count */}
        {!isLoading && !error && (
          <div className="mb-3">
            <p className="text-xs text-slate-400 font-bold">
              {filteredInstructors.length} instrutor{filteredInstructors.length !== 1 ? 'es' : ''} encontrado{filteredInstructors.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Instructor list / grids responsivos */}
        <div className="pt-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 animate-pulse">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                      <div className="h-2.5 bg-slate-100 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <EmptyState
              icon={AlertCircle}
              title="Ops! Algo deu errado"
              description={(error as Error).message}
              action={
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Tentar novamente
                </button>
              }
            />
          ) : filteredInstructors.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum instrutor encontrado"
              description="Tente ajustar os filtros ou a busca por nome/região."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {filteredInstructors.map((instructor) => (
                <motion.button
                  key={instructor.id}
                  type="button"
                  onClick={() => onSelectInstructor(instructor.id)}
                  className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex gap-3.5 items-center hover:border-blue-100 hover:shadow-md transition-all active:scale-[0.99] text-left cursor-pointer"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-13 h-13 rounded-xl bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center border border-slate-100">
                    {instructor.profilePicture && (
                      instructor.profilePicture.trim().toLowerCase().startsWith('http://') ||
                      instructor.profilePicture.trim().toLowerCase().startsWith('https://') ||
                      instructor.profilePicture.trim().toLowerCase().startsWith('data:image/') ||
                      instructor.profilePicture.trim().toLowerCase().startsWith('/')
                    ) ? (
                      <img src={instructor.profilePicture} alt={instructor.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-400 font-extrabold text-lg">{instructor.name?.charAt(0)}</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-slate-900 text-sm leading-tight truncate">{instructor.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {instructor.location || 'Local não informado'} · {instructor.transmission === 'Automatic' ? 'Automático' : 'Manual'}
                    </p>
                    <p className="text-xs font-extrabold text-blue-600 mt-1">R$ {instructor.pricePerClass}/hora</p>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span className="bg-blue-50 text-blue-600 text-xs font-black px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                      ★ {instructor.rating?.toFixed(1) || '—'}
                    </span>
                    {instructor.reviewsCount !== undefined && instructor.reviewsCount > 0 && (
                      <p className="text-[10px] font-semibold text-slate-400">{instructor.reviewsCount} avaliaçõ{instructor.reviewsCount === 1 ? 'e' : 'es'}</p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

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
      </AnimatePresence>
    </div>
  );
};
