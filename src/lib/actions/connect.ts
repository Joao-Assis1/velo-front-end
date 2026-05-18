"use server";

import { fetchWrapper } from "../api-client";

export type StripeAccountStatus = 'PENDING' | 'ONBOARDING' | 'ACTIVE' | 'RESTRICTED';

export interface ConnectStatus {
  stripeAccountId: string | null;
  stripeAccountStatus: StripeAccountStatus;
  stripePayoutsEnabled: boolean;
}

export async function getConnectStatusAction() {
  try {
    const res = await fetchWrapper<any>('/payments-stripe/connect/status');
    return { success: true, data: (res?.data ?? res) as ConnectStatus };
  } catch (error: any) {
    return { success: false, error: error.message as string };
  }
}

export async function startConnectOnboardingAction() {
  try {
    const res = await fetchWrapper<any>('/payments-stripe/connect/onboard', { method: 'POST' });
    const data = res?.data ?? res;
    return { success: true, data: data as { url: string; expiresAt: number } };
  } catch (error: any) {
    return { success: false, error: error.message as string };
  }
}
