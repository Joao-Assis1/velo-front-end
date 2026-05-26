"use client";
import { useQuery } from "@tanstack/react-query";
import { listClinics, Clinic } from "@/lib/api/clinics";

export function useClinicCatalog(
  type: "MEDICAL" | "PSYCHOLOGICAL",
  uf: string = "MS",
  city: string = "Campo Grande",
) {
  return useQuery<Clinic[]>({
    queryKey: ["clinics", type, uf, city],
    queryFn: () => listClinics({ type, uf, city }),
    staleTime: 5 * 60_000,
  });
}
