"use client";

import { useJourney, useJourneyTimeline } from "@/hooks/useJourney";
import { JourneyStepper } from "@/components/journey/JourneyStepper";
import { NextStepCard } from "@/components/journey/NextStepCard";
import { JourneyBlockerBanner } from "@/components/journey/JourneyBlockerBanner";

export default function ConciergePage() {
  const state = useJourney();
  const timeline = useJourneyTimeline();

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
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
      <header>
        <h1 className="text-2xl font-bold">Minha Jornada</h1>
        <p className="text-sm text-zinc-600">
          Etapa atual: <strong>{journey.stage}</strong> · Progresso:{" "}
          {journey.progressPct}%
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <JourneyStepper steps={steps} />
      </section>

      <JourneyBlockerBanner blockers={journey.blockers} />
      <NextStepCard blockers={journey.blockers} stage={journey.stage} />
    </main>
  );
}
