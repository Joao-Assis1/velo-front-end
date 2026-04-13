"use server";

import { fetchWrapper } from "../api-client";
import { StudentType } from "../validations";
import { Instructor } from "../../types";

export async function loginStudentAction() {
  try {
    // Busca todos os alunos via API e pega o primeiro para simular login
    const students = await fetchWrapper<any[]>("/students");
    if (!students || students.length === 0) return { success: false, error: "No students found" };
    return { success: true, data: students[0] as StudentType };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function loginInstructorAction() {
  try {
    // Busca todos os instrutores via API e pega o primeiro para simular login
    const instructors = await fetchWrapper<any[]>("/instructors");
    if (!instructors || instructors.length === 0) return { success: false, error: "No instructors found" };

    const instructor = instructors[0];
    const primaryVehicle = instructor.vehicles?.[0];

    const mapped: Instructor = {
      id: instructor.id,
      email: instructor.email,
      name: instructor.name,
      profilePicture: instructor.profilePicture || undefined,
      rating: instructor.rating,
      reviewsCount: instructor.reviewsCount,
      pricePerClass: instructor.pricePerClass || undefined,
      location: instructor.location || undefined,
      bio: instructor.bio || undefined,
      instructorType: instructor.instructorType as any,
      vehicleId: primaryVehicle?.id,
      vehicleModel: primaryVehicle?.model,
      transmission: primaryVehicle?.transmission as any,
      availability: instructor.availabilities?.map((a: any) => ({
        id: a.id,
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
        isEnabled: a.isEnabled
      })) || []
    };

    return { success: true, data: mapped };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
