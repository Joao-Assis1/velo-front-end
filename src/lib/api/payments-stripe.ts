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

export async function createSetupIntent(): Promise<{ clientSecret: string }> {
  const res = await fetchWrapper<Wrapped<{ clientSecret: string }>>(
    "/payments-stripe/setup-intent",
    { method: "POST" },
  );
  return res.data;
}

export async function attachCard(
  stripePaymentMethodId: string,
): Promise<SavedCard> {
  const res = await fetchWrapper<Wrapped<SavedCard>>(
    "/payments-stripe/payment-methods",
    { method: "POST", body: JSON.stringify({ stripePaymentMethodId }) },
  );
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

export type LessonChargeResult = {
  paymentId: string;
  clientSecret: string;
};

export async function createLessonCharge(
  lessonId: string,
  paymentMethodId: string,
): Promise<LessonChargeResult> {
  const res = await fetchWrapper<Wrapped<LessonChargeResult>>(
    "/payments-stripe/charge",
    { method: "POST", body: JSON.stringify({ lessonId, paymentMethodId }) },
  );
  return res.data;
}
