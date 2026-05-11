"use client";

import React from 'react';
import { Star, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { Card, Button } from '@/components/ui-custom';
import { Instructor } from '@/types';
import { cn } from '@/lib/utils';

interface InstructorCardProps {
  instructor: Instructor;
  onClick?: () => void;
}

export const InstructorCard = ({ instructor, onClick }: InstructorCardProps) => {
  return (
    <Card 
      className="group flex flex-col sm:flex-row items-center gap-6 p-6 hover:border-velo-blue/30 transition-all hover:shadow-xl hover:shadow-slate-200/50 cursor-pointer active:scale-[0.99]"
      onClick={onClick}
    >
      {/* Profile Image & Rating */}
      <div className="relative shrink-0">
        <div className="w-24 h-24 sm:w-20 sm:h-20 rounded-3xl overflow-hidden border-4 border-white shadow-md group-hover:rotate-3 transition-transform">
          {instructor.profilePicture ? (
            <img src={instructor.profilePicture} alt={instructor.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500 font-bold text-2xl">
              {instructor.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-sm">
          <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            {instructor.rating.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-slate-900 truncate">{instructor.name}</h3>
          {instructor.instructorType === 'Credenciado' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-velo-blue/10 text-velo-blue text-[10px] font-black uppercase rounded-md self-center sm:self-auto">
              <ShieldCheck size={12} /> CFC Validado
            </span>
          )}
        </div>

        <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
          {instructor.location && (
            <div className="flex items-center gap-1.5 text-slate-500 text-sm">
              <MapPin size={16} className="text-slate-400" />
              <span>{instructor.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase">
              {instructor.transmission || 'Manual'}
            </span>
          </div>
        </div>

        {instructor.bio && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-2 italic">{instructor.bio}</p>
        )}
      </div>

      {/* Price & Action */}
      <div className="shrink-0 w-full sm:w-auto flex flex-row sm:flex-col items-center justify-between sm:text-right border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 gap-4">
        <div>
          <p className="text-2xl font-black text-slate-900 leading-none">
            R$ {instructor.pricePerClass}
          </p>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">por aula</p>
        </div>
        <Button size="sm" className="bg-velo-blue hover:bg-velo-blue-dark group-hover:gap-3 transition-all">
          <span className="hidden sm:inline">Ver Perfil</span>
          <ArrowRight size={16} />
        </Button>
      </div>
    </Card>
  );
};
