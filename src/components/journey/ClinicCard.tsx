"use client";
import { MapPin, Phone } from "lucide-react";
import type { Clinic } from "@/lib/api/clinics";
import { Button } from "@/components/ui/button";

export function ClinicCard({
  clinic,
  onSelect,
  selected = false,
}: {
  clinic: Clinic;
  onSelect: (c: Clinic) => void;
  selected?: boolean;
}) {
  return (
    <article
      data-testid={`clinic-${clinic.id}`}
      className={`rounded-xl border p-4 transition ${
        selected ? "border-blue-500 bg-blue-50" : "border-zinc-200 bg-white"
      }`}
    >
      <h3 className="text-base font-semibold">{clinic.name}</h3>
      <p className="mt-1 flex items-center gap-1 text-sm text-zinc-600">
        <MapPin className="h-4 w-4" aria-hidden /> {clinic.address},{" "}
        {clinic.city}/{clinic.uf}
      </p>
      {clinic.phone && (
        <p className="mt-1 flex items-center gap-1 text-sm text-zinc-600">
          <Phone className="h-4 w-4" aria-hidden /> {clinic.phone}
        </p>
      )}
      <Button
        className="mt-3 w-full"
        variant={selected ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect(clinic)}
      >
        {selected ? "Selecionada" : "Selecionar"}
      </Button>
    </article>
  );
}
