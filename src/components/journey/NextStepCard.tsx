"use client";
import Link from "next/link";
import { ArrowRight, PartyPopper } from "lucide-react";
import type { JourneyBlocker, JourneyStage } from "@/lib/api/journey";
import { resolveBlockerMessage } from "@/i18n/journeyBlockerMessages";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NextStepCard({
  blockers,
  stage,
}: {
  blockers: JourneyBlocker[];
  stage?: JourneyStage;
}) {
  if (!blockers.length && stage === "READY_FOR_PRACTICAL_EXAM") {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-5">
        <div className="flex items-center gap-3">
          <PartyPopper className="h-6 w-6 text-emerald-600" aria-hidden />
          <div>
            <h3 className="font-semibold text-emerald-900">
              Pronto para o exame DETRAN
            </h3>
            <p className="text-sm text-emerald-800">
              Marque seu exame prático oficial pelo site do DETRAN-MS.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const first = blockers[0];
  if (!first) return null;
  const msg = resolveBlockerMessage(first.code);

  return (
    <div className="rounded-xl border border-blue-300 bg-blue-50 p-5">
      <h3 className="font-semibold text-blue-900">{msg.title}</h3>
      <p className="mt-1 text-sm text-blue-800">{msg.description}</p>
      {msg.ctaHref && (
        <Link href={msg.ctaHref} className={cn(buttonVariants({ size: "sm" }), "mt-3")}>
          {msg.ctaLabel ?? "Continuar"}{" "}
          <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}
