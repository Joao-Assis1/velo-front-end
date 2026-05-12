"use server";

import { fetchWrapper } from "../api-client";

export async function processPaymentAction(dto: {
  amount: number;
  studentId: string;
  paymentMethodId: string;
  lessonId?: string;
}) {
  try {
    const res = await fetchWrapper<any>("/payments/process", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getStudentPaymentsAction(studentId: string) {
  try {
    const res = await fetchWrapper<any>(`/payments?studentId=${studentId}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPaymentByIdAction(id: string) {
  try {
    const res = await fetchWrapper<any>(`/payments/${id}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
