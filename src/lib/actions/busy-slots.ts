"use server";

import { fetchWrapper } from "../api-client";

export async function createBusySlotAction(dto: {
  instructorId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}) {
  try {
    const res = await fetchWrapper<any>("/busy-slots", {
      method: "POST",
      body: JSON.stringify(dto),
    });
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getInstructorBusySlotsAction(instructorId: string) {
  try {
    const res = await fetchWrapper<any>(`/busy-slots/instructor/${instructorId}`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBusySlotAction(id: string) {
  try {
    await fetchWrapper<any>(`/busy-slots/${id}`, {
      method: "DELETE",
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
