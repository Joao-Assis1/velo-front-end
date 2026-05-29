"use client";

import { useState } from "react";
import Link from "next/link";
import { useJourney, useJourneyTimeline } from "@/hooks/useJourney";
import { JourneyStage } from "@/lib/api/journey";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { JourneyStepper } from "@/components/journey/JourneyStepper";
import { NextStepCard } from "@/components/journey/NextStepCard";
import { JourneyBlockerBanner } from "@/components/journey/JourneyBlockerBanner";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, ChevronDown, ChevronUp } from "lucide-react";

type GuideEntry = {
  step: number;
  title: string;
  description: string;
  cost: string;
  href: string;
  external?: boolean;
};

const JOURNEY_GUIDE: GuideEntry[] = [
  {
    step: 1,
    title: "Curso teórico",
    description: "Estude no app CNH do Brasil no seu próprio ritmo. Conclua o curso antes de abrir o processo no DETRAN-MS.",
    cost: "Gratuito",
    href: "/app/student/theory-course",
  },
  {
    step: 2,
    title: "RENACH — Abertura do processo",
    description: "Pague a taxa de serviço, agende pelo site ou telefone do DETRAN-MS e compareça para coleta de biometria facial e digitais.",
    cost: "Taxa DETRAN-MS",
    href: "/app/student/renach",
  },
  {
    step: 3,
    title: "Exames médico, psicológico e teórico",
    description: "O DETRAN-MS agenda e conduz os três exames na Central de Exames (Pátio Central, Campo Grande). Leve RG e CPF. Toxicológico obrigatório para categorias A e B (Lei 15.153/2025).",
    cost: "R$ 200–400",
    href: "https://meudetran.ms.gov.br/",
    external: true,
  },
  {
    step: 4,
    title: "LADV",
    description: "Emitida via app CNH do Brasil após aprovação nos exames. Válida por 12 meses.",
    cost: "Gratuita",
    href: "/app/student/ladv",
  },
  {
    step: 5,
    title: "Aulas práticas",
    description: "Mínimo 2 horas com instrutor credenciado (Resolução CONTRAN 1.020/2025).",
    cost: "R$ 60–120 / aula",
    href: "/app/student/schedule",
  },
  {
    step: 6,
    title: "Exame prático DETRAN",
    description: "Duração ~15 minutos. Agendado pelo site DETRAN-MS.",
    cost: "~R$ 100",
    href: "https://meudetran.ms.gov.br/",
    external: true,
  },
];

const STAGE_LABELS: Record<JourneyStage, string> = {
  REGISTERED: "Registrado",
  THEORY_COURSE_IN_PROGRESS: "Curso Teórico em Andamento",
  RENACH_PENDING: "RENACH Pendente",
  AWAITING_LADV_UPLOAD: "Aguardando Envio da LADV",
  LADV_UPLOADED_VALID: "LADV Validada",
  PRACTICAL_IN_PROGRESS: "Aulas Práticas em Andamento",
  READY_FOR_PRACTICAL_EXAM: "Pronto para o Exame Prático",
};

export default function ConciergePage() {
  const state = useJourney();
  const timeline = useJourneyTimeline();
  const { status: pushStatus, subscribe: subscribePush } = usePushNotifications();
  const [guideOpen, setGuideOpen] = useState(false);

  if (state.isLoading || timeline.isLoading) {
    return <p className="p-4 text-sm text-zinc-500">Carregando jornada…</p>;
  }
  if (state.isError || timeline.isError) {
    return (
      <p className="p-4 text-sm text-rose-600">
        Não foi possível carregar sua jornada. Tente novamente.
      </p>
    );
  }
  const journey = state.data!;
  const steps = timeline.data!;

  return (
    <main className="flex w-full flex-col gap-6 p-4">
      <header>
        <h1 className="text-2xl font-bold">Minha Jornada</h1>
        <p className="text-sm text-zinc-600">
          Etapa atual: <strong>{STAGE_LABELS[journey.stage] ?? journey.stage}</strong> · Progresso:{" "}
          {journey.progressPct}%
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setGuideOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-zinc-50 transition-colors"
          aria-expanded={guideOpen}
        >
          <span className="text-sm font-semibold text-zinc-700">
            Entenda a jornada completa
          </span>
          {guideOpen ? (
            <ChevronUp size={16} className="text-zinc-400 shrink-0" />
          ) : (
            <ChevronDown size={16} className="text-zinc-400 shrink-0" />
          )}
        </button>

        {guideOpen && (
          <ul className="divide-y divide-zinc-100 border-t border-zinc-100">
            {JOURNEY_GUIDE.map((entry) => (
              <li key={entry.step} className="flex items-start gap-3 px-4 py-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                  {entry.step}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-800">{entry.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{entry.description}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                      {entry.cost}
                    </span>
                    {entry.external ? (
                      <a
                        href={entry.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Ver etapa →
                      </a>
                    ) : (
                      <Link href={entry.href} className="text-xs text-blue-600 hover:underline">
                        Ver etapa →
                      </Link>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {pushStatus === "idle" && (
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3">
          <div className="flex items-center gap-2 text-sm text-zinc-700">
            <Bell className="h-4 w-4 text-zinc-500" aria-hidden />
            Receba notificações quando sua etapa avançar
          </div>
          <Button size="sm" variant="outline" onClick={subscribePush}>
            Ativar
          </Button>
        </div>
      )}
      {pushStatus === "granted" && (
        <p className="flex items-center gap-1 text-xs text-emerald-700">
          <Bell className="h-3 w-3" aria-hidden /> Notificações ativas
        </p>
      )}
      {pushStatus === "denied" && (
        <p className="flex items-center gap-1 text-xs text-zinc-500">
          <BellOff className="h-3 w-3" aria-hidden /> Notificações bloqueadas —
          habilite nas configurações do navegador
        </p>
      )}

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <JourneyStepper steps={steps} />
      </section>

      <JourneyBlockerBanner blockers={journey.blockers} />
      <NextStepCard blockers={journey.blockers} stage={journey.stage} />
    </main>
  );
}
