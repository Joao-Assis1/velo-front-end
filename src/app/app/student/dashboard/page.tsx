"use client";

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, Button } from '@/components/ui-custom';
import { BurocraticConcierge } from '@/components/features/BurocraticConcierge';
import { DetranStepper } from '@/components/features/DetranStepper';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { DetranStage } from '@/types';

const mockAlerts = [
  {
    id: 'a1',
    type: 'warning' as const,
    title: 'Exame Médico Próximo',
    message: 'Seu exame médico vence em 15 dias. Lembre-se de renovar para não travar suas aulas práticas.'
  }
];

export default function StudentDashboard() {
  const { studentProfile, detranStages } = useApp();

  return (
    <div className="pb-24 pt-6 px-4 md:px-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <p className="text-slate-500 text-sm font-medium">Bem-vindo de volta,</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{studentProfile?.name || 'Aluno'}</h1>
        </div>
        <div className="w-12 h-12 bg-velo-blue/10 rounded-2xl flex items-center justify-center border border-velo-blue/20">
          <TrendingUp className="text-velo-blue" size={24} />
        </div>
      </header>

      {/* Concierge Alerts */}
      <BurocraticConcierge alerts={mockAlerts} onDismiss={(id) => console.log('Dismiss', id)} />

      {/* DETRAN Progress */}
      <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sua Jornada</h2>
            <p className="text-sm text-slate-500">Acompanhe seu progresso legal no DETRAN</p>
          </div>
          <span className="bg-velo-blue-light text-velo-blue text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
            {Math.round((detranStages.filter(s => s.status === 'completed').length / detranStages.length) * 100)}% Concluído
          </span>
        </div>
        
        <DetranStepper stages={detranStages} />
      </section>

      {/* Quick Actions & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academy Card */}
        <Link href="/app/student/academy" className="group">
          <Card className="h-full border-none bg-slate-900 text-white p-6 overflow-hidden relative transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md">
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-1">Velo Academy</h3>
              <p className="text-slate-400 text-sm mb-6">Continue seu curso teórico de onde parou.</p>
              
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-velo-blue w-[65%]" />
                </div>
                <span className="text-xs font-bold">65%</span>
              </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-velo-blue/20 rounded-full blur-3xl" />
          </Card>
        </Link>

        {/* Marketplace Card */}
        <Link href="/app/student/instructors" className="group">
          <Card className="h-full border-2 border-slate-100 p-6 hover:border-velo-blue/30 transition-all hover:shadow-xl hover:shadow-slate-200/50 active:scale-[0.98]">
            <div className="w-12 h-12 bg-velo-blue-light rounded-xl flex items-center justify-center mb-4">
              <Search className="text-velo-blue" size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Buscar Instrutor</h3>
            <p className="text-slate-500 text-sm mb-6">Encontre os melhores instrutores credenciados perto de você.</p>
            
            <div className="flex items-center text-velo-blue font-bold text-sm group-hover:gap-2 transition-all">
              Ver marketplace <ArrowRight size={18} className="ml-1" />
            </div>
          </Card>
        </Link>
      </div>

      {/* Next Lesson Preview */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Próxima Aula</h3>
        <Card className="flex items-center gap-4 p-4 border-l-4 border-l-velo-blue">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-slate-600">
            <span className="text-[10px] font-bold uppercase tracking-tighter">Maio</span>
            <span className="text-xl font-black leading-none">12</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900">Direção Defensiva</h4>
            <div className="flex items-center gap-3 mt-0.5">
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={12} /> 14:00 - 15:40
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <MapPin size={12} /> Unidade Centro
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            Detalhes
          </Button>
        </Card>
      </section>
    </div>
  );
}
