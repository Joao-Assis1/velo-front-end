"use server";

import { revalidateTag } from "next/cache";
import { fetchWrapper } from "../api-client";
import { CreateStudentDto, StudentType } from "../validations";

export async function createStudentAction(data: CreateStudentDto) {
  try {
    const student = await fetchWrapper<any>("/students", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    revalidateTag("students", "default");
    return { success: true, data: student as StudentType };
  } catch (error: any) {
    console.error("Error creating student:", error);
    return { success: false, error: error.message };
  }
}

export async function getStudentAction(id: string) {
  try {
    const student = await fetchWrapper<any>(`/students/${id}`, {
      next: { tags: ["students"] },
    });
    
    if (!student) {
      throw new Error("Student not found");
    }

    return { success: true, data: student as StudentType };
  } catch (error: any) {
    console.error("Error fetching student:", error);
    return { success: false, error: error.message };
  }
}
