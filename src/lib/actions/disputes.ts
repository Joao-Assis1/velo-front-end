"use server";

import { revalidateTag } from "next/cache";
import { fetchWrapper } from "../api-client";

export async function openDisputeAction(lessonId: string, reason: string) {
  try {
    const apiResponse = await fetchWrapper<any>(`/disputes/${lessonId}/open`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    revalidateTag("lessons", "default");
    return { success: true, data: apiResponse?.data };
  } catch (error: any) {
    console.error("Error opening dispute:", error);
    return { success: false, error: error.message };
  }
}
