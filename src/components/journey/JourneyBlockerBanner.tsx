"use client";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { JourneyBlocker } from "@/lib/api/journey";
import { resolveBlockerMessage } from "@/i18n/journeyBlockerMessages";

export function JourneyBlockerBanner({
  blockers,
}: {
  blockers: JourneyBlocker[];
}) {
  if (!blockers.length) return null;
  const first = blockers[0];
  const msg = resolveBlockerMessage(first.code);
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3"
    >
      <AlertTriangle
        className="mt-0.5 h-5 w-5 shrink-0 text-amber-600"
        aria-hidden
      />
      <div className="text-sm">
        <p className="font-semibold text-amber-900">{msg.title}</p>
        <p className="text-amber-800">{msg.description}</p>
        {msg.ctaHref && (
          <Link
            href={msg.ctaHref}
            className="mt-1 inline-block font-medium text-amber-900 underline"
          >
            {msg.ctaLabel ?? "Resolver"}
          </Link>
        )}
      </div>
    </div>
  );
}
