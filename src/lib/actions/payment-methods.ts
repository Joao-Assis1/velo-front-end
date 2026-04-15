"use server";

import { fetchWrapper } from "../api-client";

export async function addPaymentMethodAction(dto: {
  studentId: string;
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  isDefault?: boolean;
}) {
  try {
    const res = await fetchWrapper<any>("/payment-methods", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getStudentPaymentMethodsAction(studentId: string) {
  try {
    const res = await fetchWrapper<any>(`/payment-methods/student/${studentId}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePaymentMethodAction(id: string) {
  try {
    await fetchWrapper<any>(`/payment-methods/${id}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function setDefaultPaymentMethodAction(id: string) {
  try {
    const res = await fetchWrapper<any>(`/payment-methods/${id}/default`, {
      method: "PATCH",
    });
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
