"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, ArrowLeft, Loader2, MapPin } from 'lucide-react';
import { InstructorCard } from '@/components/features/InstructorCard';
import { InstructorFilter } from '@/components/features/InstructorFilter';
import { getInstructorsAction } from '@/lib/actions/instructors';
import { Instructor, InstructorFilter as FilterType } from '@/types';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

export default function InstructorMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterType>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: instructors = [], isLoading } = useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const response = await getInstructorsAction();
      return response.data as Instructor[] || [];
    }
  });

  const filteredInstructors = instructors.filter(instructor => {
    // Hide inactive instructors (e.g. credential expired)
    if (instructor.isActive === false) return false;

    const matchesSearch = instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (instructor.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesPrice = !filters.maxPrice || (instructor.pricePerClass || 0) <= filters.maxPrice;
    
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Desktop Sidebar Filters */}
      <aside className="hidden lg:block w-80 bg-white border-r border-slate-200 h-screen sticky top-0 p-8 overflow-y-auto">
        <InstructorFilter filters={filters} onFilterChange={setFilters} />
      </aside>

      <main className="flex-1 p-4 md:p-8 lg:p-12 space-y-8 max-w-6xl mx-auto">
        {/* Header Mobile/Tablet */}
        <div className="flex items-center gap-4">
          <Link href="/app/student/dashboard" className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Marketplace</h1>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-velo-blue transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome, bairro ou cidade..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-velo-blue/20 focus:ring-4 focus:ring-velo-blue/5 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <SlidersHorizontal size={24} />
          </button>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            {filteredInstructors.length} Instrutores encontrados
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <MapPin size={14} />
            <span>Belo Horizonte, MG</span>
          </div>
        </div>

        {/* Instructor Grid */}
        <section className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-velo-blue" />
              <p className="font-bold uppercase tracking-widest text-xs">Carregando especialistas...</p>
            </div>
          ) : filteredInstructors.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredInstructors.map((instructor) => (
                <InstructorCard 
                  key={instructor.id} 
                  instructor={instructor} 
                  onClick={() => console.log('Select', instructor.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Search}
              title="Nenhum instrutor encontrado"
              description="Tente ajustar os filtros ou limpar sua busca para ver mais opções."
            />
          )}
        </section>
      </main>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-t-[32px] shadow-2xl overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2" />
              <InstructorFilter 
                filters={filters} 
                onFilterChange={setFilters} 
                isModal 
                onClose={() => setIsFilterOpen(false)} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
