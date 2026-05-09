"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, Circle, Loader2, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '@/context/AppContext';
import { DetranStepper } from '@/components/features/DetranStepper';
import { BurocraticConcierge, AlertType } from '@/components/features/BurocraticConcierge';
import { Card } from '@/components/ui-custom';
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
      { id: '1', label: 'Cadastro / RENACH', status: 'completed' },
      { id: '2', label: 'Exame Médico', status: 'current' },
      { id: '3', label: 'Curso Teórico', status: 'locked' },
      { id: '4', label: 'LADV & Aulas', status: 'locked' },
      { id: '5', label: 'Exame Final', status: 'locked' },
    ];
  }
  const stage2done = c.medico && c.psicotecnico;
  const stage3done = c.teorico;
  const stage4done = c.pratico;
  return [
    { id: '1', label: 'Cadastro / RENACH', status: 'completed' },
    { id: '2', label: 'Exame Médico', status: stage2done ? 'completed' : 'current' },
    { id: '3', label: 'Curso Teórico', status: stage3done ? 'completed' : stage2done ? 'current' : 'locked' },
    { id: '4', label: 'LADV & Aulas', status: stage4done ? 'completed' : stage3done ? 'current' : 'locked' },
    { id: '5', label: 'Exame Final', status: stage4done ? 'current' : 'locked' },
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
  { key: 'teorico', label: 'Curso Teórico', description: 'Módulos da Velo Academy concluídos' },
  { key: 'pratico', label: 'Aulas Práticas', description: 'LADV enviada e aulas práticas realizadas' },
];

export const StudentConcierge = () => {
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

  return (
    <div className="pb-28 md:pb-10 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">O Navegador</h1>
        <p className="text-slate-500 text-sm">Sua jornada rumo à carteira de motorista</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-velo-blue" size={32} />
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">
              Progresso DETRAN
            </h2>
            <DetranStepper stages={stages} />
          </Card>

          {alerts.length > 0 && (
            <BurocraticConcierge
              alerts={alerts}
              onDismiss={(id) => setDismissedAlerts(prev => [...prev, id])}
            />
          )}

          <Card>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              Checklist de Etapas
            </h2>
            <div className="space-y-3">
              {STEPS.map((step) => {
                const done = checklist?.[step.key] ?? false;
                return (
                  <button
                    key={step.key}
                    onClick={() => mutation.mutate({ step: step.key, completed: !done })}
                    disabled={mutation.isPending}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left",
                      done
                        ? "border-green-200 bg-green-50"
                        : "border-slate-100 hover:border-velo-blue hover:bg-blue-50"
                    )}
                  >
                    {done
                      ? <CheckCircle2 size={24} className="text-green-500 shrink-0" />
                      : <Circle size={24} className="text-slate-300 shrink-0" />
                    }
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm font-bold",
                        done ? "text-green-700 line-through" : "text-slate-900"
                      )}>
                        {step.label}
                      </p>
                      <p className="text-xs text-slate-500">{step.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="bg-slate-900 text-white border-none">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-velo-blue shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-sm mb-1">Encontre o DETRAN mais próximo</p>
                <p className="text-xs text-white/60 mb-3">
                  Consulte os endereços e horários de atendimento dos postos do DETRAN na sua região.
                </p>
                <a
                  href="https://www.detran.sp.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-velo-blue bg-velo-blue/10 hover:bg-velo-blue/20 px-3 py-1.5 rounded-full transition-colors"
                >
                  Acessar DETRAN <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
