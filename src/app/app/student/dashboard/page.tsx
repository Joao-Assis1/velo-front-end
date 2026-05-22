"use client";

import React, { useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Card, Button } from '@/components/ui-custom';
import { BurocraticConcierge } from '@/components/features/BurocraticConcierge';
import { DetranStepper } from '@/components/features/DetranStepper';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import { NextStepCard } from '@/components/journey/NextStepCard';
import { useJourney, useJourneyTimeline } from '@/hooks/useJourney';
import { JourneyStage } from '@/lib/api/journey';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STAGE_ALERTS: Partial<Record<JourneyStage, { id: string; type: 'urgent' | 'warning' | 'info'; title: string; message: string }>> = {
  RENACH_PENDING:       { id: 'renach', type: 'urgent',  title: 'Cadastro Incompleto',           message: 'Preencha seus dados pessoais para iniciar o processo do RENACH.' },
  MEDICAL_PENDING:      { id: 'medico', type: 'warning', title: 'Exame Médico Pendente',          message: 'Agende seu exame médico em uma clínica credenciada pelo DETRAN para avançar.' },
  PSYCH_PENDING:        { id: 'psico',  type: 'warning', title: 'Exame Psicotécnico Pendente',    message: 'Agende seu exame psicotécnico em uma clínica credenciada pelo DETRAN.' },
  THEORY_EXAM_PENDING:  { id: 'teoria', type: 'warning', title: 'Exame Teórico Pendente',         message: 'Você precisa realizar o exame teórico no DETRAN para prosseguir.' },
  AWAITING_LADV_UPLOAD: { id: 'ladv',   type: 'info',    title: 'LADV Pendente',                  message: 'Sua LADV ainda não foi validada. Você precisa dela para agendar as aulas práticas.' },
};

export default function StudentDashboard() {
  const { data: journey, isLoading: journeyLoading } = useJourney();
  const { data: timeline = [] } = useJourneyTimeline();
  const { studentProfile, academyModules, scheduledClasses, refreshLessons } = useApp();

  useEffect(() => {
    refreshLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const academyProgress = useMemo(() => {
    if (!academyModules.length) return 0;
    return Math.round((academyModules.filter(m => m.progress === 100).length / academyModules.length) * 100);
  }, [academyModules]);

  const nextLesson = useMemo(() => {
    const now = new Date();
    return scheduledClasses
      .filter(c => (c.status === 'upcoming' || c.status === 'pending_acceptance') && new Date(c.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null;
  }, [scheduledClasses]);

  const detranStages = useMemo(() =>
    timeline.map((step, i) => ({
      id: step.key,
      label: step.label,
      status: step.status === 'completed' ? 'completed' as const
            : step.status === 'in_progress' ? 'current' as const
            : 'locked' as const,
    })),
  [timeline]);

  const alerts = useMemo(() => {
    if (!journey) return [];
    const stageAlert = STAGE_ALERTS[journey.stage];
    if (stageAlert) return [stageAlert];
    if (journey.blockers.length > 0) {
      return [{ id: journey.blockers[0].code, type: 'info' as const, title: 'Ação necessária', message: journey.blockers[0].message }];
    }
    return [];
  }, [journey]);

  return (
    <div className="pb-24 pt-6 px-4 md:px-8 space-y-8 max-w-5xl mx-auto">
      {/* Journey next step */}
      {!journeyLoading && journey && (
        <NextStepCard blockers={journey.blockers} stage={journey.stage} />
      )}

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
      <BurocraticConcierge alerts={alerts} onDismiss={(id) => console.log('Dismiss', id)} />

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

      {/* Marketplace Hero */}
      <Link href="/app/student/instructors" className="group block">
        <div className="relative overflow-hidden rounded-3xl bg-velo-blue p-6 transition-all hover:shadow-2xl hover:shadow-velo-blue/30 active:scale-[0.98]">
          <div className="relative z-10">
            <p className="text-blue-300 text-[11px] font-black uppercase tracking-widest mb-2">Marketplace</p>
            <h3 className="text-2xl font-black text-white leading-tight mb-1">
              Encontre Seu<br />Instrutor Ideal
            </h3>
            <p className="text-blue-200 text-sm mb-5">
              Instrutores credenciados com disponibilidade na sua cidade.
            </p>
            <div className="inline-flex items-center gap-2 bg-white text-velo-blue text-sm font-black px-4 py-2.5 rounded-2xl shadow-sm group-hover:gap-3 transition-all">
              Buscar agora <ArrowRight size={16} />
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-52 h-52 bg-white/5 rounded-full" />
          <div className="absolute right-6 -bottom-6 w-28 h-28 bg-blue-900/50 rounded-full" />
          <div className="absolute right-20 top-4 w-10 h-10 bg-white/10 rounded-full" />
        </div>
      </Link>

      {/* Academy Card */}
      <Link href="/app/student/academy" className="group block">
        <Card className="border-none bg-slate-900 text-white p-6 overflow-hidden relative transition-transform hover:scale-[1.01] active:scale-[0.98]">
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3 backdrop-blur-md">
                <BookOpen className="text-white" size={20} />
              </div>
              <h3 className="text-lg font-bold mb-0.5">Velo Academy</h3>
              <p className="text-slate-400 text-sm">Teste seus conhecimentos com simulados do DETRAN</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-white">{academyProgress}%</span>
              <p className="text-slate-400 text-xs">concluído</p>
            </div>
          </div>
          <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-velo-blue rounded-full" style={{ width: `${academyProgress}%` }} />
          </div>
          <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-velo-blue/20 rounded-full blur-3xl" />
        </Card>
      </Link>

      {/* Next Lesson Preview */}
      {nextLesson && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Próxima Aula</h3>
          <Link href="/app/student/schedule">
            <Card className="flex items-center gap-4 p-4 border-l-4 border-l-velo-blue cursor-pointer hover:border-velo-blue/80 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-slate-600">
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  {format(new Date(nextLesson.date), 'MMM', { locale: ptBR })}
                </span>
                <span className="text-xl font-black leading-none">
                  {format(new Date(nextLesson.date), 'd')}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900">
                  {nextLesson.instructorName ? `Aula com ${nextLesson.instructorName}` : 'Aula Prática'}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock size={12} /> {nextLesson.startTime}{nextLesson.endTime ? ` - ${nextLesson.endTime}` : ''}
                </p>
                {nextLesson.status === 'pending_acceptance' && (
                  <p className="text-[10px] font-bold text-amber-600 mt-1">Aguardando confirmação do instrutor</p>
                )}
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Detalhes
              </Button>
            </Card>
          </Link>
        </section>
      )}
    </div>
  );
}
