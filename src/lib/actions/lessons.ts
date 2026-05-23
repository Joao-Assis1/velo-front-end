"use server";

import { revalidateTag } from "next/cache";
import { fetchWrapper } from "../api-client";
import { CreateLessonDto, LessonType } from "../validations";
import { BiometryStage } from "../../types";
import { parseBRDate } from "../utils/dates";

function mapLesson(lesson: any): LessonType {
  return {
    id: lesson.id,
    studentId: lesson.studentId,
    instructorId: lesson.instructorId,
    instructorName: lesson.instructor?.name,
    date: parseBRDate(lesson.date) ?? new Date(),
    startTime: lesson.startTime,
    endTime: lesson.endTime,
    status: lesson.status as any,
    price: lesson.price || undefined,
    studentFeedbackRating: lesson.studentFeedbackRating || undefined,
    studentFeedbackText: lesson.studentFeedbackText || undefined,
    instructorFeedback: lesson.instructorFeedback || undefined,
    studentName: lesson.student?.name,
    studentImage: lesson.student?.profilePicture || undefined,
    checkInTime: lesson.checkInTime ? parseBRDate(lesson.checkInTime) ?? undefined : undefined,
    checkOutTime: lesson.checkOutTime ? parseBRDate(lesson.checkOutTime) ?? undefined : undefined,
    durationMinutes: lesson.durationMinutes || undefined,
    disputeOpened: lesson.disputeOpened ?? false,
    disputeReason: lesson.disputeReason || undefined,
    paymentReleased: lesson.paymentReleased ?? false,
  };
}

export async function getLessonsAction(
  query: { studentId?: string; instructorId?: string } = {},
) {
  try {
    const params = new URLSearchParams();
    if (query.studentId) params.append("studentId", query.studentId);
    if (query.instructorId) params.append("instructorId", query.instructorId);

    const apiResponse = await fetchWrapper<any>(
      `/lessons?${params.toString()}`,
      {
        next: { tags: ["lessons"] },
      },
    );

    const lessons = apiResponse?.data ?? [];
    return { success: true, data: (lessons as any[]).map(mapLesson) };
  } catch (error: any) {
    console.error("Error fetching lessons:", error);
    return { success: false, error: error.message };
  }
}

export async function createLessonAction(data: CreateLessonDto) {
  try {
    const apiResponse = await fetchWrapper<any>("/lessons", {
      method: "POST",
      body: JSON.stringify(data),
    });

    revalidateTag("lessons", "default");
    return { success: true, data: mapLesson(apiResponse?.data) };
  } catch (error: any) {
    console.error("Error creating lesson:", error);
    return { success: false, error: error.message };
  }
}

export async function checkInAction(id: string) {
  try {
    const apiResponse = await fetchWrapper<any>(`/lessons/${id}/checkin`, {
      method: "PATCH",
    });

    revalidateTag("lessons", "default");
    return { success: true, data: mapLesson(apiResponse?.data) };
  } catch (error: any) {
    console.error("Error check-in:", error);
    return { success: false, error: error.message };
  }
}

export async function checkOutAction(id: string) {
  try {
    const apiResponse = await fetchWrapper<any>(`/lessons/${id}/checkout`, {
      method: "PATCH",
    });

    revalidateTag("lessons", "default");
    return { success: true, data: mapLesson(apiResponse?.data) };
  } catch (error: any) {
    console.error("Error check-out:", error);
    return { success: false, error: error.message };
  }
}

export async function submitStudentFeedbackAction(
  id: string,
  rating: number,
  text: string,
) {
  try {
    const apiResponse = await fetchWrapper<any>(
      `/lessons/${id}/feedback-student`,
      {
        method: "PATCH",
        body: JSON.stringify({ rating, text }),
      },
    );

    revalidateTag("lessons", "default");
    return { success: true, data: mapLesson(apiResponse?.data) };
  } catch (error: any) {
    console.error("Error student feedback:", error);
    return { success: false, error: error.message };
  }
}

export async function submitInstructorFeedbackAction(
  id: string,
  feedback: string,
) {
  try {
    const apiResponse = await fetchWrapper<any>(
      `/lessons/${id}/feedback-instructor`,
      {
        method: "PATCH",
        body: JSON.stringify({ feedback }),
      },
    );

    revalidateTag("lessons", "default");
    return { success: true, data: mapLesson(apiResponse?.data) };
  } catch (error: any) {
    console.error("Error instructor feedback:", error);
    return { success: false, error: error.message };
  }
}

export async function submitBiometryAction(
  id: string,
  stage: BiometryStage,
  coords: { lat: number; lng: number },
  status = "SUCCESS",
) {
  try {
    const step = stage.toLowerCase() as "start" | "mid" | "end";
    return await fetchWrapper<any>(`/lessons/${id}/biometry`, {
      method: "POST",
      body: JSON.stringify({ lat: coords.lat, lng: coords.lng, status, step }),
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function acceptLessonAction(id: string) {
  try {
    const apiResponse = await fetchWrapper<any>(`/lessons/${id}/accept`, {
      method: "PATCH",
    });

    revalidateTag("lessons", "default");
    return { success: true, data: mapLesson(apiResponse?.data) };
  } catch (error: any) {
    console.error("Error accepting lesson:", error);
    return { success: false, error: error.message };
  }
}

export async function rejectLessonAction(id: string) {
  try {
    const apiResponse = await fetchWrapper<any>(`/lessons/${id}/reject`, {
      method: "PATCH",
    });

    revalidateTag("lessons", "default");
    return { success: true, data: mapLesson(apiResponse?.data) };
  } catch (error: any) {
    console.error("Error rejecting lesson:", error);
    return { success: false, error: error.message };
  }
}

export async function cancelLessonAction(id: string) {
  try {
    const apiResponse = await fetchWrapper<any>(`/lessons/${id}/cancel`, {
      method: "PATCH",
    });

    revalidateTag("lessons", "default");
    return { success: true, data: mapLesson(apiResponse?.data) };
  } catch (error: any) {
    console.error("Error cancelling lesson:", error);
    return { success: false, error: error.message };
  }
}

export async function getEscrowStatusAction(id: string) {
  try {
    return await fetchWrapper<any>(`/lessons/${id}/escrow`);
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitTelemetryBatchAction(lessonId: string, points: any[]) {
  try {
    return await fetchWrapper<any>("/telemetria/batch", {
      method: "POST",
      body: JSON.stringify({ lessonId, points }),
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
