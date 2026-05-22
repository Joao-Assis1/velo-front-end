"use client";

import {
  useJourneyTimeline,
  useJourney,
  useDeclareReadyForExam,
} from "@/hooks/useJourney";
import { JourneyStepper } from "@/components/journey/JourneyStepper";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProgressPage() {
  const state = useJourney();
  const timeline = useJourneyTimeline();
  const declare = useDeclareReadyForExam();
  const [error, setError] = useState<string | null>(null);

  if (state.isLoading || timeline.isLoading) {
    return <p className="p-4 text-sm text-zinc-500">Carregando…</p>;
  }
  const journey = state.data!;
  const steps = timeline.data!;
  const canDeclare =
    journey.stage === "PRACTICAL_IN_PROGRESS" &&
    journey.blockers.every((b) => b.code !== "MINIMUM_LEGAL_NOT_MET");

  async function handleDeclare() {
    setError(null);
    try {
      await declare.mutateAsync();
    } catch (e: any) {
      setError(e?.message ?? "Não foi possível declarar.");
    }
  }

  return (
    <main className="flex w-full flex-col gap-6 p-4">
      <header>
        <h1 className="text-2xl font-bold">Progresso da 1ª CNH</h1>
        <p className="text-sm text-zinc-600">
          Acompanhe cada etapa exigida pela Resolução CONTRAN 1.020/2025.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <JourneyStepper steps={steps} />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Declarar pronto para o exame</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Quando cumprir as 2 horas mínimas de aulas práticas válidas, declare
          que está pronto para marcar o exame oficial no DETRAN-MS.
        </p>
        <Button
          className="mt-3"
          onClick={handleDeclare}
          disabled={!canDeclare || declare.isPending}
        >
          {declare.isPending ? "Enviando…" : "Estou pronto para o exame"}
        </Button>
        {error && (
          <p role="alert" className="mt-2 text-sm text-rose-600">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
