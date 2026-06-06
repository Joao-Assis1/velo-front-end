import { fetchWrapper } from "../api-client";

type Wrapped<T> = { success: boolean; data: T; message?: string };

export type SavedCard = {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
};

export async function listCards(): Promise<SavedCard[]> {
  const res = await fetchWrapper<Wrapped<SavedCard[]>>("/payment-methods");
  return res.data;
}

export async function deleteCard(id: string): Promise<void> {
  await fetchWrapper<Wrapped<unknown>>(`/payment-methods/${id}`, {
    method: "DELETE",
  });
}

export async function setDefaultCard(id: string): Promise<void> {
  await fetchWrapper<Wrapped<unknown>>(`/payment-methods/${id}/default`, {
    method: "PATCH",
  });
}
