"use server";

import { fetchWrapper } from "../api-client";
import { StudentType } from "../validations";
import { Instructor } from "../../types";
import { cookies } from "next/headers";

export async function loginStudentAction(credentials: any) {
  try {
    const apiResponse = await fetchWrapper<any>("/auth/login/student", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    const authResult = apiResponse.data;
    if (!authResult || !authResult.user)
      return { success: false, error: "Credenciais inválidas" };

    (await cookies()).set("velo-token", authResult.access_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return {
      success: true,
      data: authResult.user,
      token: authResult.access_token,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function loginInstructorAction(credentials: any) {
  try {
    const apiResponse = await fetchWrapper<any>("/auth/login/instructor", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    const authResult = apiResponse.data;
    if (!authResult || !authResult.user)
      return { success: false, error: "Credenciais inválidas" };

    const instructor = authResult.user;
    const primaryVehicle = instructor.vehicles?.[0];

    const mapped: Instructor = {
      id: instructor.id,
      email: instructor.email,
      name: instructor.name,
      profilePicture: instructor.profilePicture || undefined,
      rating: instructor.rating || 0,
      reviewsCount: instructor.reviewsCount || 0,
      pricePerClass: instructor.pricePerClass || undefined,
      location: instructor.location || undefined,
      bio: instructor.bio || undefined,
      instructorType: instructor.instructorType as any,
      vehicleId: primaryVehicle?.id,
      vehicleModel: primaryVehicle?.model,
      transmission: primaryVehicle?.transmission as any,
      availability:
        instructor.availabilities?.map((a: any) => ({
          id: a.id,
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
          isEnabled: a.isEnabled,
        })) || [],
    };

    (await cookies()).set("velo-token", authResult.access_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { success: true, data: mapped, token: authResult.access_token };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function registerStudentAction(data: any) {
  try {
    const apiResponse = await fetchWrapper<any>("/auth/register/student", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const authResult = apiResponse.data;
    if (!authResult || !authResult.user)
      return { success: false, error: "Registration failed" };

    (await cookies()).set("velo-token", authResult.access_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return {
      success: true,
      data: authResult.user as StudentType,
      token: authResult.access_token,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function registerInstructorAction(data: any) {
  try {
    const apiResponse = await fetchWrapper<any>("/auth/register/instructor", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const authResult = apiResponse.data;
    if (!authResult || !authResult.user)
      return { success: false, error: "Registration failed" };

    (await cookies()).set("velo-token", authResult.access_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return {
      success: true,
      data: authResult.user,
      token: authResult.access_token,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function forgotPasswordAction(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await fetchWrapper<any>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Forgot password error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function resetPasswordAction(
  token: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await fetchWrapper<any>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Reset password error:", error.message);
    return { success: false, error: error.message };
  }
}
