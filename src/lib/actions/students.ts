"use server";

import { revalidateTag } from "next/cache";
import { fetchWrapper } from "../api-client";
import { CreateStudentDto, StudentType } from "../validations";

export async function createStudentAction(data: CreateStudentDto) {
  try {
    const apiResponse = await fetchWrapper<any>("/students", {
      method: "POST",
      body: JSON.stringify(data),
    });

    revalidateTag("students", "default");
    return { success: true, data: apiResponse?.data as StudentType };
  } catch (error: any) {
    console.error("Error creating student:", error);
    return { success: false, error: error.message };
  }
}

export async function getStudentAction(id: string) {
  try {
    const apiResponse = await fetchWrapper<any>(`/students/${id}`, {
      next: { tags: ["students"] },
    });
    const student = apiResponse?.data;

    if (!student) {
      throw new Error("Student not found");
    }

    return { success: true, data: student as StudentType };
  } catch (error: any) {
    console.error("Error fetching student:", error);
    return { success: false, error: error.message };
  }
}

export async function updateStudentAction(
  id: string,
  data: Partial<StudentType>,
) {
  try {
    const apiResponse = await fetchWrapper<any>(`/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    revalidateTag("students", "default");
    return { success: true, data: apiResponse?.data as StudentType };
  } catch (error: any) {
    console.error(`Error updating student ${id}:`, error);
    return { success: false, error: error.message };
  }
}

export async function uploadLadvAction(studentId: string, formData: FormData) {
  try {
    const res = await fetchWrapper<any>(`/students/${studentId}/ladv`, {
      method: "POST",
      body: formData,
    });
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLadvStatusAction(studentId: string) {
  try {
    const res = await fetchWrapper<any>(`/students/${studentId}/ladv/status`);
    return { success: true, data: res.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
