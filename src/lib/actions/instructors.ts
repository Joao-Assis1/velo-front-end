"use server";

import { fetchWrapper } from "../api-client";
import { Instructor } from "@/types";
import { InstructorType } from "../validations"; // Mantido para as outras actions

function mapInstructor(instructor: any): Instructor {
  const primaryVehicle = instructor.vehicles?.[0];
  return {
    id: instructor.id,
    email: instructor.email,
    name: instructor.name,
    phone: instructor.phone,
    profilePicture: instructor.profilePicture,
    vehicleImage: instructor.vehicleImage || primaryVehicle?.vehiclePhoto || primaryVehicle?.image || primaryVehicle?.vehicleImage,
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
    birthDate: instructor.birthDate ? new Date(instructor.birthDate) : undefined,
    cnhNumber: instructor.cnhNumber,
    cnhCategory: instructor.cnhCategory,
    cnhEar: instructor.cnhEar,
    educationLevel: instructor.educationLevel,
    renachNumber: instructor.renachNumber,
    certidaoNegativa: instructor.certidaoNegativa,
    noGravissima: instructor.noGravissima,
    hasInstructorCourse: instructor.hasInstructorCourse,
    noCassacao: instructor.noCassacao,
    hasDoubleCommand: instructor.hasDoubleCommand,
    isActive: instructor.isActive,
    detranCredentialNumber: instructor.detranCredentialNumber,
    detranCredentialUf: instructor.detranCredentialUf,
    credentialStatus: instructor.credentialStatus,
    credentialValidUntil: instructor.credentialValidUntil ? new Date(instructor.credentialValidUntil) : undefined,
    stripeAccountId: instructor.stripeAccountId,
    stripeAccountStatus: instructor.stripeAccountStatus,
    stripePayoutsEnabled: instructor.stripePayoutsEnabled,
  };
}

export async function getInstructorsAction(filters: {
  maxPrice?: number;
  minRating?: number;
  transmission?: string;
  type?: string;
} = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.maxPrice && filters.maxPrice < 150) params.append("maxPrice", filters.maxPrice.toString());
    if (filters.minRating && filters.minRating > 0) params.append("minRating", filters.minRating.toString());
    if (filters.transmission && filters.transmission !== 'Todos') params.append("transmission", filters.transmission);
    if (filters.type && filters.type !== 'Todos') params.append("type", filters.type);

    const queryString = params.toString();
    const url = `/instructors${queryString ? `?${queryString}` : ""}`;

    const apiResponse = await fetchWrapper<any>(url, {
      next: { tags: ["instructors"] },
    } as RequestInit & { next?: { tags: string[] } });

    const data = apiResponse?.data ?? apiResponse?.instructors ?? apiResponse ?? [];

    if (!Array.isArray(data)) {
      console.warn("API returned non-array data for instructors:", data);
      return { success: true, data: [] };
    }

    return { success: true, data: data.map(mapInstructor) as Instructor[] };
  } catch (error: any) {
    console.error("Erro no getInstructorsAction:", error);
    return { success: false, error: error.message };
  }
}

export async function getInstructorByIdAction(id: string) {
  try {
    const apiResponse = await fetchWrapper<any>(`/instructors/${id}`, {
      next: { tags: [`instructor-${id}`] },
    } as RequestInit & { next?: { tags: string[] } });

    const data = apiResponse?.data ?? apiResponse;
    if (!data?.id) {
      return { success: false, error: "Instrutor não encontrado" };
    }

    return { success: true, data: mapInstructor(data) as Instructor };
  } catch (error: any) {
    console.error(`Erro no getInstructorByIdAction(${id}):`, error);
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
