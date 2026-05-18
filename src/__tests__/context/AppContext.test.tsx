/**
 * 🔴 RED → 🟢 GREEN → 🔵 REFACTOR
 * Tests: AppContext – business logic (context/AppContext.tsx)
 *
 * Strategy:
 *  - Render AppProvider in a test wrapper
 *  - Mock ALL server actions (lessons, auth)
 *  - Assert that state mutations match expected behavior
 *
 * Covers:
 *  login()      – student saves token + profile; instructor idem
 *  logout()     – clears state + localStorage token
 *  bookClass()  – adds lesson to scheduledClasses on success
 *  rateClass()  – updates feedback fields optimistically
 *  checkIn()    – updates status to in-progress
 *  checkOut()   – updates status to completed and computes duration
 *  cancelClass()– removes lesson from list
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";

// ── mock server actions ───────────────────────────────────────────────────
vi.mock("@/lib/actions/lessons", () => ({
  getLessonsAction: vi.fn().mockResolvedValue({ success: true, data: [] }),
  createLessonAction: vi.fn(),
  cancelLessonAction: vi.fn().mockResolvedValue({ success: true }),
  checkInAction: vi.fn(),
  checkOutAction: vi.fn(),
  submitStudentFeedbackAction: vi.fn(),
  submitInstructorFeedbackAction: vi.fn(),
}));

vi.mock("@/lib/actions/auth", () => ({
  loginStudentAction: vi.fn(),
  loginInstructorAction: vi.fn(),
  registerStudentAction: vi.fn(),
  registerInstructorAction: vi.fn(),
}));

vi.mock("@/lib/actions/payments", () => ({
  processPaymentAction: vi.fn().mockResolvedValue({ success: true }),
  getStudentPaymentsAction: vi.fn().mockResolvedValue({ success: true, data: [] }),
  getPaymentByIdAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/lib/actions/academy", () => ({
  getAcademyModulesAction: vi.fn().mockResolvedValue({ success: true, data: [] }),
  seedAcademyAction: vi.fn().mockResolvedValue({ success: true }),
  submitAcademyScoreAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/lib/actions/profileActions", () => ({
  getStudentProfileAction: vi.fn().mockResolvedValue({ success: true }),
  updateStudentProfileAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/lib/actions/instructors", () => ({
  getInstructorsAction: vi.fn().mockResolvedValue({ success: true, data: [] }),
  updateInstructorProfileAction: vi.fn().mockResolvedValue({ success: true }),
}));

import {
  createLessonAction,
  checkInAction,
  checkOutAction,
  submitStudentFeedbackAction,
  submitInstructorFeedbackAction,
} from "@/lib/actions/lessons";
import {
  loginStudentAction,
  loginInstructorAction,
} from "@/lib/actions/auth";
import { AppProvider, useApp } from "@/context/AppContext";

// ── fixtures ──────────────────────────────────────────────────────────────
const mockLesson = {
  id: "lesson-1",
  studentId: "student-1",
  instructorId: "instructor-1",
  date: new Date("2025-06-10"),
  startTime: "10:00",
  endTime: "11:00",
  status: "upcoming" as const,
};

const mockInstructor = {
  id: "instructor-1",
  name: "Carlos",
  email: "carlos@velo.com",
  rating: 5,
  reviewsCount: 10,
  pricePerClass: 100,
  vehicleId: "vehicle-1",
  availability: [],
  busySlots: [],
};

const mockStudent = {
  id: "student-1",
  name: "Ana",
  email: "ana@velo.com",
  ladvUploaded: true,
  paymentMethods: [{ id: "pm-1", isDefault: true, isDeleted: false }],
};

// ── wrapper ───────────────────────────────────────────────────────────────
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(AppProvider, null, children);

// ── suite ─────────────────────────────────────────────────────────────────
describe("AppContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // login (student) ─────────────────────────────────────────────────────────
  describe("login – student", () => {
    it("saves token to localStorage and sets studentProfile", async () => {
      (loginStudentAction as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: mockStudent,
        token: "student-jwt",
      });

      const { result } = renderHook(() => useApp(), { wrapper });

      await act(async () => {
        result.current.setUserRole("student");
      });

      await act(async () => {
        await (result.current.login as any)({
          email: "ana@velo.com",
          password: "senha123",
        });
      });

      expect(localStorage.getItem("velo-token")).toBe("student-jwt");
      expect(result.current.studentProfile?.id).toBe("student-1");
    });
  });

  // login (instructor) ──────────────────────────────────────────────────────
  describe("login – instructor", () => {
    it("saves token and sets instructorProfile", async () => {
      (loginInstructorAction as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: mockInstructor,
        token: "instructor-jwt",
      });

      const { result } = renderHook(() => useApp(), { wrapper });

      await act(async () => {
        result.current.setUserRole("instructor");
      });

      await act(async () => {
        await (result.current.login as any)({
          email: "carlos@velo.com",
          password: "senha123",
        });
      });

      expect(localStorage.getItem("velo-token")).toBe("instructor-jwt");
      expect(result.current.instructorProfile?.id).toBe("instructor-1");
    });
  });

  // logout ──────────────────────────────────────────────────────────────────
  describe("logout", () => {
    it("clears profiles and removes token from localStorage", async () => {
      localStorage.setItem("velo-token", "my-jwt");

      const { result } = renderHook(() => useApp(), { wrapper });

      await act(async () => {
        result.current.setStudentProfile(mockStudent as any);
      });

      await act(async () => {
        result.current.logout();
      });

      expect(localStorage.getItem("velo-token")).toBeNull();
      expect(result.current.studentProfile).toBeNull();
      expect(result.current.userRole).toBeNull();
    });
  });

  // cancelClass ─────────────────────────────────────────────────────────────
  describe("cancelClass", () => {
    it("removes the lesson from scheduledClasses", async () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      await act(async () => {
        result.current.setScheduledClasses([mockLesson] as any);
      });

      await act(async () => {
        result.current.cancelClass("lesson-1");
      });

      expect(result.current.scheduledClasses).toHaveLength(0);
    });
  });

  // bookClass ───────────────────────────────────────────────────────────────
  describe("bookClass", () => {
    it("adds the new lesson to scheduledClasses on success", async () => {
      (createLessonAction as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: mockLesson,
      });

      const { result } = renderHook(() => useApp(), { wrapper });

      await act(async () => {
        result.current.setStudentProfile(mockStudent as any);
        result.current.setUserRole("student");
      });

      await act(async () => {
        await result.current.bookClass(
          new Date("2025-06-10"),
          "10:00",
          "11:00",
          mockInstructor as any
        );
      });

      expect(result.current.scheduledClasses).toHaveLength(1);
      expect(result.current.scheduledClasses[0].id).toBe("lesson-1");
    });

    it("throws when createLessonAction returns failure", async () => {
      (createLessonAction as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: false,
        error: "Slot occupied",
      });

      const { result } = renderHook(() => useApp(), { wrapper });

      await act(async () => {
        result.current.setStudentProfile(mockStudent as any);
        result.current.setUserRole("student");
      });

      await expect(
        act(async () => {
          await result.current.bookClass(
            new Date("2025-06-10"),
            "10:00",
            "11:00",
            mockInstructor as any
          );
        })
      ).rejects.toThrow("Slot occupied");
    });
  });

  // rateClass ───────────────────────────────────────────────────────────────
  describe("rateClass", () => {
    it("updates studentFeedback fields on the lesson", async () => {
      (submitStudentFeedbackAction as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: { ...mockLesson, studentFeedbackRating: 5, studentFeedbackText: "Top!" },
      });

      const { result } = renderHook(() => useApp(), { wrapper });

      await act(async () => {
        result.current.setScheduledClasses([mockLesson] as any);
      });

      await act(async () => {
        await result.current.rateClass("lesson-1", 5, "Top!");
      });

      const lesson = result.current.scheduledClasses[0] as any;
      expect(lesson.studentFeedbackRating).toBe(5);
      expect(lesson.studentFeedbackText).toBe("Top!");
    });
  });

  // checkIn ─────────────────────────────────────────────────────────────────
  describe("checkIn", () => {
    it("updates lesson status to in-progress", async () => {
      (checkInAction as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: { ...mockLesson, status: "in-progress" },
      });

      const { result } = renderHook(() => useApp(), { wrapper });

      await act(async () => {
        result.current.setScheduledClasses([mockLesson] as any);
      });

      await act(async () => {
        await result.current.checkIn("lesson-1");
      });

      expect(result.current.scheduledClasses[0].status).toBe("in-progress");
    });
  });

  // checkOut ────────────────────────────────────────────────────────────────
  describe("checkOut", () => {
    it("updates status to completed and calculates durationMinutes", async () => {
      (checkOutAction as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: { ...mockLesson, status: "completed" },
      });

      const checkedInLesson = {
        ...mockLesson,
        status: "in-progress" as const,
        checkInTime: new Date(Date.now() - 60 * 60 * 1000), // 1h ago
      };

      const { result } = renderHook(() => useApp(), { wrapper });

      await act(async () => {
        result.current.setScheduledClasses([checkedInLesson] as any);
      });

      await act(async () => {
        await result.current.checkOut("lesson-1");
      });

      const lesson = result.current.scheduledClasses[0] as any;
      expect(lesson.status).toBe("completed");
      expect(lesson.durationMinutes).toBeGreaterThan(0);
    });
  });
});
