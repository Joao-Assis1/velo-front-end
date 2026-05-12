"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowLeft, Loader2, MapPin, Star, ShieldCheck, Car } from 'lucide-react';
import { InstructorFilter } from '@/components/features/InstructorFilter';
import { getInstructorsAction } from '@/lib/actions/instructors';
import { Instructor, InstructorFilter as FilterType } from '@/types';
import { EmptyState } from '@/components/ui-custom/EmptyState';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function InstructorMarketplace() {
  const router = useRouter();
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
    if (instructor.isActive === false) return false;
    const matchesSearch = instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (instructor.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesPrice = !filters.maxPrice || (instructor.pricePerClass || 0) <= filters.maxPrice;
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-white md:flex">
      {/* Desktop Sidebar Filters */}
      <aside className="hidden lg:block w-72 bg-slate-50 border-r border-slate-100 h-screen sticky top-0 p-8 overflow-y-auto shrink-0">
        <InstructorFilter filters={filters} onFilterChange={setFilters} />
      </aside>

      <main className="flex-1 min-w-0">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-100">
          <div className="px-4 md:px-8 pt-5 pb-4 space-y-4">
            <div className="flex items-center gap-3">
              <Link
                href="/app/student/dashboard"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="flex-1">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Instrutores</h1>
                {!isLoading && (
                  <p className="text-xs text-slate-400 font-medium">
                    {filteredInstructors.length} disponíveis ·{' '}
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin size={10} /> Belo Horizonte, MG
                    </span>
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors shrink-0"
              >
                <SlidersHorizontal size={16} />
              </button>
            </div>

            <div className="relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Nome, bairro ou cidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-velo-blue/40 focus:ring-2 focus:ring-velo-blue/10 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Instructor Grid */}
        <div className="px-4 md:px-8 py-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin mb-3 text-velo-blue" />
              <p className="font-bold uppercase tracking-widest text-xs">Buscando instrutores...</p>
            </div>
          ) : filteredInstructors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredInstructors.map((instructor, i) => (
                <motion.button
                  key={instructor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.22 }}
                  onClick={() => router.push(`/app/student/instructors/${instructor.id}`)}
                  className="group text-left bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100 transition-all active:scale-[0.99]"
                >
                  {/* Photo area */}
                  <div className="relative bg-slate-100 h-44 overflow-hidden">
                    {instructor.profilePicture ? (
                      <img
                        src={instructor.profilePicture}
                        alt={instructor.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-6xl select-none">
                        {instructor.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}

                    {/* Rating badge */}
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />
                      {instructor.rating?.toFixed(1) ?? '—'}
                    </div>

                    {/* Type badge */}
                    {instructor.instructorType && (
                      <div className={cn(
                        "absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1",
                        instructor.instructorType === 'Credenciado'
                          ? "bg-velo-blue text-white"
                          : "bg-amber-500 text-white"
                      )}>
                        {instructor.instructorType === 'Credenciado' && <ShieldCheck size={9} />}
                        {instructor.instructorType}
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-slate-900 text-base leading-tight">
                        {instructor.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-black text-slate-900 tabular-nums leading-none">
                          R${instructor.pricePerClass ?? '—'}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">/hora</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      {instructor.location && (
                        <p className="text-slate-400 text-xs flex items-center gap-1 truncate">
                          <MapPin size={11} className="shrink-0 text-slate-300" />
                          {instructor.location}
                        </p>
                      )}
                      {instructor.vehicleModel && (
                        <p className="text-slate-400 text-xs flex items-center gap-1 truncate">
                          <Car size={11} className="shrink-0 text-slate-300" />
                          {instructor.vehicleModel}
                          {instructor.transmission && (
                            <span className="text-slate-300 ml-0.5">· {instructor.transmission}</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="Nenhum instrutor encontrado"
              description="Tente ajustar os filtros ou buscar por outra localização."
            />
          )}
        </div>
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
