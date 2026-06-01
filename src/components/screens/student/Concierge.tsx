"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Loader2, MapPin, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '@/context/AppContext';
import { BurocraticConcierge, AlertType } from '@/components/features/BurocraticConcierge';
import { DetranStage } from '@/types';
import { getStudentChecklistAction, updateChecklistStepAction } from '@/lib/actions/students';
import { cn } from '@/lib/utils';

type ChecklistStep = 'medico' | 'psicotecnico' | 'teorico' | 'pratico';

interface Checklist {
  medico: boolean;
  psicotecnico: boolean;
  teorico: boolean;
  pratico: boolean;
}

function deriveStages(c: Checklist | null): DetranStage[] {
  if (!c) {
    return [
      { id: '1', label: 'RENACH', status: 'completed' },
      { id: '2', label: 'Médico', status: 'current' },
      { id: '3', label: 'Teórico', status: 'locked' },
      { id: '4', label: 'Aulas', status: 'locked' },
      { id: '5', label: 'Exame', status: 'locked' },
    ];
  }
  const stage2done = c.medico && c.psicotecnico;
  const stage3done = c.teorico;
  const stage4done = c.pratico;
  return [
    { id: '1', label: 'RENACH', status: 'completed' },
    { id: '2', label: 'Médico', status: stage2done ? 'completed' : 'current' },
    { id: '3', label: 'Teórico', status: stage3done ? 'completed' : stage2done ? 'current' : 'locked' },
    { id: '4', label: 'Aulas', status: stage4done ? 'completed' : stage3done ? 'current' : 'locked' },
    { id: '5', label: 'Exame', status: stage4done ? 'current' : 'locked' },
  ];
}

function deriveAlerts(c: Checklist | null): Array<{ id: string; type: AlertType; title: string; message: string }> {
  if (!c) return [];
  const alerts: Array<{ id: string; type: AlertType; title: string; message: string }> = [];
  if (!c.medico || !c.psicotecnico) {
    alerts.push({
      id: 'medico',
      type: 'info',
      title: 'Exames médicos pendentes',
      message: 'Agende seus exames médico e psicotécnico no DETRAN da sua região para avançar.',
    });
  }
  if (c.medico && c.psicotecnico && !c.teorico) {
    alerts.push({
      id: 'teorico',
      type: 'warning',
      title: 'Curso teórico pendente',
      message: 'Complete o curso teórico na Velo Academy antes de agendar aulas práticas.',
    });
  }
  if (c.teorico && !c.pratico) {
    alerts.push({
      id: 'pratico',
      type: 'info',
      title: 'Aulas práticas pendentes',
      message: 'Faça upload da LADV e agende suas aulas práticas com um instrutor credenciado.',
    });
  }
  return alerts;
}

const STEPS: { key: ChecklistStep; label: string; description: string }[] = [
  { key: 'medico', label: 'Exame Médico', description: 'Apto ao exame de acuidade visual e saúde geral' },
  { key: 'psicotecnico', label: 'Exame Psicotécnico', description: 'Avaliação psicológica aprovada pelo DETRAN' },
  { key: 'teorico', label: 'Curso Teórico', description: 'Módulos concluídos na autoescola / Velo Academy' },
  { key: 'pratico', label: 'Aulas Práticas', description: 'LADV emitida e 20 horas de aulas práticas concluídas' },
];

export const StudentConcierge = () => {
  const router = useRouter();
  const { studentProfile } = useApp();
  const queryClient = useQueryClient();
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const { data: checklist, isLoading } = useQuery({
    queryKey: ['checklist', studentProfile?.id],
    queryFn: async () => {
      if (!studentProfile?.id) return null;
      const res = await getStudentChecklistAction(studentProfile.id);
      return res.success ? res.data : null;
    },
    enabled: !!studentProfile?.id,
  });

  const mutation = useMutation({
    mutationFn: ({ step, completed }: { step: ChecklistStep; completed: boolean }) => {
      if (!studentProfile?.id) throw new Error('No student ID');
      return updateChecklistStepAction(studentProfile.id, step, completed);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['checklist'] }),
  });

  const stages = deriveStages(checklist ?? null);
  const alerts = deriveAlerts(checklist ?? null).filter(a => !dismissedAlerts.includes(a.id));
  const currentStage = stages.find(s => s.status === 'current');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dark Header com Stepper DETRAN Horizontal */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-5 pt-7 pb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full translate-y-[-20%] translate-x-[20%] pointer-events-none blur-2xl" />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-blue-400">Progresso Habilitação</p>
              <h1 className="text-xl font-extrabold text-slate-50 mt-0.5">Jornada do Condutor</h1>
            </div>
            <div className="flex items-center gap-1 bg-slate-800/80 border border-slate-700/50 rounded-full px-2.5 py-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-300">DETRAN MS</span>
            </div>
          </div>

          {/* Stepper Horizontal Inline Premium */}
          <div className="flex items-center justify-between mt-6 px-1 max-w-2xl mx-auto">
            {stages.map((stage, i) => (
              <React.Fragment key={stage.id}>
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 shadow-md",
                    stage.status === 'completed'
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : stage.status === 'current'
                        ? "bg-blue-600 text-white shadow-blue-600/30 ring-4 ring-blue-600/20"
                        : "bg-slate-800 border border-slate-700 text-slate-500"
                  )}>
                    {stage.status === 'completed' ? '✓' : i + 1}
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold text-center leading-tight tracking-wide",
                    stage.status === 'completed' ? "text-emerald-400" :
                      stage.status === 'current' ? "text-blue-400" :
                        "text-slate-500"
                  )}>
                    {stage.label}
                  </span>
                </div>
                {i < stages.length - 1 && (
                  <div className={cn(
                    "flex-1 h-[2px] mx-2 -mt-5 transition-all duration-500",
                    stage.status === 'completed' ? "bg-emerald-500" : "bg-slate-800 border-t border-dashed border-slate-700"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal Responsivo (Grid 2/3 + 1/3 no Desktop) */}
      <div className="px-4 pb-28 md:pb-10 pt-6 max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="animate-spin text-blue-600" size={28} />
            <p className="text-xs font-semibold text-slate-400">Carregando jornada...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
          >
            {/* Coluna da Esquerda: Checklist de Etapas */}
            <div className="md:col-span-2 space-y-3.5">
              <div className="flex items-center justify-between px-1 mb-1">
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Checklist Obrigatório</p>
                {checklist && (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {Object.values(checklist).filter(Boolean).length} de 4 concluídos
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {STEPS.map((step) => {
                  const done = checklist?.[step.key] ?? false;
                  const isPratico = step.key === 'pratico';
                  return (
                    <button
                      key={step.key}
                      onClick={() =>
                        isPratico
                          ? router.push('/app/student/instructors')
                          : mutation.mutate({ step: step.key, completed: !done })
                      }
                      disabled={mutation.isPending}
                      className={cn(
                        "w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4.5 flex items-center gap-4 text-left transition-all duration-200 active:scale-[0.98] cursor-pointer group",
                        done
                          ? "border-emerald-100/80 bg-emerald-50/20"
                          : "hover:bg-slate-50/50 hover:border-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                        done
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 text-transparent group-hover:border-slate-400"
                      )}>
                        {done && <CheckCircle2 size={12} className="text-white fill-white" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-extrabold transition-all",
                          done ? "text-slate-400 line-through" : "text-slate-800"
                        )}>
                          {step.label}
                        </p>
                        <p className={cn(
                          "text-xs mt-0.5 truncate",
                          done ? "text-slate-350" : "text-slate-450"
                        )}>
                          {isPratico ? 'Buscar instrutor credenciado' : step.description}
                        </p>
                      </div>

                      {isPratico && !done && (
                        <ChevronRight size={16} className="text-slate-400 shrink-0 group-hover:text-blue-600 transition-colors" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Coluna da Direita: Status e Links Complementares */}
            <div className="space-y-5">
              <div className="px-1 mb-1 hidden md:block">
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Informações e Links</p>
              </div>

              {/* Alerta de Etapa Atual */}
              {currentStage && (
                <div className="bg-blue-50/80 border border-blue-100 border-l-4 border-l-blue-600 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 text-blue-600 mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-600/90">Estágio Atual</p>
                    <p className="text-sm font-extrabold text-slate-800 mt-0.5 truncate">
                      {currentStage.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Conclua os exames e as aulas teóricas/práticas marcadas no painel lateral para avançar.
                    </p>
                  </div>
                </div>
              )}

              {/* Burocratic Alerts */}
              {alerts.length > 0 && (
                <BurocraticConcierge
                  alerts={alerts}
                  onDismiss={(id) => setDismissedAlerts(prev => [...prev, id])}
                />
              )}

              {/* Link DETRAN Oficial */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4.5 flex flex-col gap-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center border border-slate-100/50 shrink-0">
                    <ExternalLink size={18} />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-800 text-sm">Site DETRAN MS</p>
                    <p className="text-xs text-slate-400">Taxas e serviços online</p>
                  </div>
                </div>
                <a
                  href="https://www.meudetran.ms.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-extrabold text-center block text-white bg-blue-600 hover:bg-blue-700 w-full py-2.5 rounded-xl shadow-md shadow-blue-600/10 transition-all active:scale-[0.98]"
                >
                  Acessar DETRAN MS
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
