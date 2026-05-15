"use client";
import { Check, CircleDashed, Clock, AlertOctagon } from "lucide-react";
import type { TimelineStep } from "@/lib/api/journey";
import { cn } from "@/lib/utils";

const icons = {
  completed: Check,
  in_progress: Clock,
  upcoming: CircleDashed,
  blocked: AlertOctagon,
} as const;

const tones = {
  completed: "bg-emerald-500 text-white border-emerald-500",
  in_progress: "bg-blue-500 text-white border-blue-500 animate-pulse",
  upcoming: "bg-zinc-100 text-zinc-500 border-zinc-300",
  blocked: "bg-rose-500 text-white border-rose-500",
} as const;

export function JourneyStepper({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-2">
      {steps.map((s, idx) => {
        const Icon = icons[s.status];
        return (
          <li
            key={s.key}
            data-testid={`step-${s.key}`}
            data-status={s.status}
            aria-current={s.status === "in_progress" ? "step" : undefined}
            className="flex flex-1 items-center gap-3 md:flex-col md:gap-1 md:text-center"
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                tones[s.status],
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <div className="flex flex-col md:items-center">
              <span className="text-sm font-medium leading-tight">
                {s.label}
              </span>
              {s.status === "blocked" && s.blockedReason && (
                <span className="text-xs text-rose-600">{s.blockedReason}</span>
              )}
            </div>
            {idx < steps.length - 1 && (
              <div
                aria-hidden
                className="hidden h-px flex-1 bg-zinc-200 md:block"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
