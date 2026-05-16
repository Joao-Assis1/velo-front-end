"use client";

import { useJourney, useJourneyTimeline } from "@/hooks/useJourney";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { JourneyStepper } from "@/components/journey/JourneyStepper";
import { NextStepCard } from "@/components/journey/NextStepCard";
import { JourneyBlockerBanner } from "@/components/journey/JourneyBlockerBanner";
import { Button } from "@/components/ui/button";
import { Bell, BellOff } from "lucide-react";

export default function ConciergePage() {
  const state = useJourney();
  const timeline = useJourneyTimeline();
  const { status: pushStatus, subscribe: subscribePush } = usePushNotifications();

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
