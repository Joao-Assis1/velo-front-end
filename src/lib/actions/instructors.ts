"use server";

import { fetchWrapper } from "../api-client";
import { Instructor } from "@/types";
import { InstructorType } from "../validations"; // Mantido para as outras actions

export async function getInstructorsAction() {
  try {
    const apiResponse = await fetchWrapper<any>("/instructors", {
      next: { tags: ["instructors"] },
    } as RequestInit & { next?: { tags: string[] } });

    const data = apiResponse?.data ?? [];

    const mappedInstructors: Instructor[] = (data as any[]).map(
      (instructor) => {
        const primaryVehicle = instructor.vehicles?.[0];

        return {
          id: instructor.id,
          email: instructor.email,
          name: instructor.name,
          profilePicture: instructor.profilePicture,
          vehicleImage: instructor.vehicleImage,
          vehicleModel: primaryVehicle?.model,
          vehiclePlate: primaryVehicle?.plate,
          vehicleYear: primaryVehicle?.year,
          rating: instructor.rating,
          reviewsCount: instructor.reviewsCount,
          pricePerClass: instructor.pricePerClass,
          location: instructor.location,
          bio: instructor.bio,
          transmission: primaryVehicle?.transmission,
          instructorType: instructor.instructorType,
          vehicleId: primaryVehicle?.id,
          availability: instructor.availabilities ?? [],
          busySlots: instructor.busySlots ?? [],
        };
      },
    );

    return { success: true, data: mappedInstructors };
  } catch (error: any) {
    console.error("Erro no getInstructorsAction:", error);
    return { success: false, error: error.message };
  }
}

export async function updateInstructorProfileAction(
  id: string,
  data: Partial<InstructorType>,
) {
  try {
    const apiResponse = await fetchWrapper<any>(`/instructors/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    return { success: true, data: apiResponse?.data };
  } catch (error: any) {
    console.error(`Error updating instructor ${id}:`, error);
    return { success: false, error: error.message };
  }
}

export async function getInstructorEarningsAction(
  id: string,
  month?: number,
  year?: number,
) {
  try {
    const queryParams = new URLSearchParams();
    if (month !== undefined) queryParams.append("month", month.toString());
    if (year !== undefined) queryParams.append("year", year.toString());

    const queryString = queryParams.toString();
    const url = `/instructors/${id}/earnings${queryString ? `?${queryString}` : ""}`;

    const apiResponse = await fetchWrapper<any>(url, {
      next: { tags: ["instructor-earnings"] },
    });

    return { success: true, data: apiResponse?.data };
  } catch (error: any) {
    console.error(`Error fetching earnings for instructor ${id}:`, error);
    return { success: false, error: error.message };
  }
}
