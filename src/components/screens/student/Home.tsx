"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_INSTRUCTORS } from '@/constants/mockData';
import { FilterModal } from './FilterModal';

export const StudentHome = ({ onSelectInstructor }: { onSelectInstructor: (id: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: 150,
    minRating: 0,
    transmission: 'Todos',
    type: 'Todos'
  });

  const filteredInstructors = MOCK_INSTRUCTORS.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          instructor.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (instructor.price > filters.maxPrice) return false;
    if (instructor.rating < filters.minRating) return false;
    if (filters.transmission !== 'Todos' && instructor.transmission !== filters.transmission) return false;
    if (filters.type !== 'Todos' && instructor.type !== filters.type) return false;

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
      </AnimatePresence>

      {/* Instructors List */}
      <section className="space-y-4">
        {filteredInstructors.length > 0 ? (
          filteredInstructors.map((instructor) => (
            <div 
              key={instructor.id} 
              className="group flex items-center gap-4 p-4 rounded-3xl bg-white border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all cursor-pointer active:scale-[0.99]"
              onClick={() => onSelectInstructor(instructor.id)}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
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
                  R$ {instructor.price}
                </p>
                <p className="text-xs text-slate-400 font-medium">/hora</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={24} />
            </div>
            <p className="text-slate-500 font-medium">Nenhum instrutor encontrado</p>
            <p className="text-slate-400 text-sm mt-1">Tente mudar os filtros</p>
          </div>
        )}
      </section>
    </div>
  );
};
