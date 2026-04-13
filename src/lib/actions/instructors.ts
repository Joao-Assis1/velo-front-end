"use server";

import { fetchWrapper } from "../api-client";
import { InstructorType } from "../validations";

export async function getInstructorsAction() {
  try {
    const response = await fetchWrapper<any[]>("/instructors", {
      next: { tags: ["instructors"] },
    });

    const mappedInstructors: InstructorType[] = response.map((instructor) => {
      const primaryVehicle = instructor.vehicles?.[0];
      return {
        id: instructor.id,
        name: instructor.name,
        profilePicture: instructor.profilePicture || undefined,
        rating: instructor.rating,
        reviewsCount: instructor.reviewsCount,
        pricePerClass: instructor.pricePerClass || undefined,
        location: instructor.location || undefined,
        bio: instructor.bio || undefined,
        instructorType: (instructor.instructorType as any) || undefined,
        vehicleId: primaryVehicle?.id,
        vehicleModel: primaryVehicle?.model,
        vehiclePlate: primaryVehicle?.plate,
        vehicleYear: primaryVehicle?.year || undefined,
        transmission: (primaryVehicle?.transmission as any) || undefined,
        availability: instructor.availabilities?.map((a: any) => ({
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
          isEnabled: a.isEnabled,
        })) || [],
      };
    });

    return { success: true, data: mappedInstructors };
  } catch (error: any) {
    console.error("Error fetching instructors:", error);
    return { success: false, error: error.message };
  }
}
