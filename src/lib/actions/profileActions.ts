"use server";

import { fetchWrapper } from "../api-client";

export async function getStudentProfileAction(id: string) {
  try {
    const apiResponse = await fetchWrapper<any>(`/students/${id}`);
    return { success: true, data: apiResponse?.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateStudentProfileAction(id: string, data: any) {
  try {
    const apiResponse = await fetchWrapper<any>(`/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        ladvUploaded: data.ladvUploaded,
        profilePicture: data.profilePicture,
        birthDate: data.birthDate,
        motherName: data.motherName,
        intendedCategory: data.intendedCategory,
        ufDomicile: data.ufDomicile,
      }),
    });

    return { success: true, data: apiResponse?.data };
  } catch (error: any) {
    console.error("Erro no updateStudentProfileAction:", error);
    return { success: false, error: error.message };
  }
}

export async function updateInstructorAvailabilityAction(
  instructorId: string,
  availabilities: any[],
) {
  try {
    const apiResponse = await fetchWrapper<any>(
      `/availability/instructor/${instructorId}`,
      {
        method: "PUT",
        body: JSON.stringify(availabilities),
      },
    );

    return { success: true, data: apiResponse?.data };
  } catch (error: any) {
    console.error("Erro no updateInstructorAvailabilityAction:", error);
    return { success: false, error: error.message };
  }
}

export async function checkInBookingAction(bookingId: string) {
  console.warn(
    "[DEPRECATED] checkInBookingAction from profileActions is deprecated. Use checkInAction from lessons.ts instead."
  );
  throw new Error(
    "This action has been consolidated. Use checkInAction from lessons.ts or AppContext.checkIn()"
  );
}

export async function checkOutBookingAction(bookingId: string) {
  console.warn(
    "[DEPRECATED] checkOutBookingAction from profileActions is deprecated. Use checkOutAction from lessons.ts instead."
  );
  throw new Error(
    "This action has been consolidated. Use checkOutAction from lessons.ts or AppContext.checkOut()"
  );
}

export async function submitStudentFeedbackAction(
  bookingId: string,
  rating: number,
  feedback: string,
) {
  try {
    const apiResponse = await fetchWrapper<any>(
      `/lessons/${bookingId}/feedback-student`,
      {
        method: "PATCH",
        body: JSON.stringify({ rating, text: feedback }),
      },
    );

    return { success: true, data: apiResponse?.data };
  } catch (error: any) {
    console.error("Erro no submitStudentFeedbackAction:", error);
    return { success: false, error: error.message };
  }
}

export async function submitInstructorFeedbackAction(
  bookingId: string,
  feedback: string,
) {
  try {
    const apiResponse = await fetchWrapper<any>(
      `/lessons/${bookingId}/feedback-instructor`,
      {
        method: "PATCH",
        body: JSON.stringify({ feedback }),
      },
    );

    return { success: true, data: apiResponse?.data };
  } catch (error: any) {
    console.error("Erro no submitInstructorFeedbackAction:", error);
    return { success: false, error: error.message };
  }
}

export async function bookClassAction(
  studentId: string,
  instructorId: string,
  date: Date,
  startTime: string,
  price: number,
) {
  try {
    const apiResponse = await fetchWrapper<any>("/lessons", {
      method: "POST",
      body: JSON.stringify({
        studentId,
        instructorId,
        date,
        startTime,
        endTime: startTime,
        price,
      }),
    });

    return { success: true, data: apiResponse?.data };
  } catch (error: any) {
    console.error("Erro no bookClassAction (Double Booking Prevented):", error);
    return { success: false, error: error.message };
  }
}

export async function updateInstructorVehicleAction(
  instructorId: string,
  vehicleData: any,
) {
  try {
    const apiResponse = await fetchWrapper<any>(
      `/vehicles/instructor/${instructorId}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          model: vehicleData.vehicleModel,
          plate: vehicleData.vehiclePlate,
          year: vehicleData.vehicleYear,
          transmission: vehicleData.transmission,
        }),
      },
    );

    return { success: true, data: apiResponse?.data };
  } catch (error: any) {
    console.error("Erro no updateInstructorVehicleAction:", error);
    return { success: false, error: error.message };
  }
}

export async function uploadVehiclePhotoAction(vehicleId: string, file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const apiResponse = await fetchWrapper<any>(`/vehicles/${vehicleId}/photo`, {
      method: "PATCH",
      body: formData,
    });
    return { success: true, data: apiResponse?.data };
  } catch (error: any) {
    console.error("Erro no uploadVehiclePhotoAction:", error);
    return { success: false, error: error.message };
  }
}
