import { fetchWrapper } from "../api-client";

export type Clinic = {
  id: string;
  name: string;
  type: "MEDICAL" | "PSYCHOLOGICAL";
  city: string;
  uf: string;
  address: string;
  phone: string | null;
  active: boolean;
};

type Paginated<T> = { items: T[]; page: number; pageSize: number; total: number };
type Wrapped<T> = { success: boolean; data: T; message?: string };

export async function listClinics(params: {
  type: "MEDICAL" | "PSYCHOLOGICAL";
  uf?: string;
  city?: string;
}): Promise<Clinic[]> {
  const qs = new URLSearchParams();
  qs.set("type", params.type);
  if (params.uf) qs.set("uf", params.uf);
  if (params.city) qs.set("city", params.city);
  const res = await fetchWrapper<Wrapped<Paginated<Clinic>>>(`/clinics?${qs}`);
  return res.data?.items ?? [];
}
