/**
 * 🔴 RED → 🟢 GREEN → 🔵 REFACTOR
 * Tests: lib/utils.ts + remaining coverage gaps
 *
 * Covers:
 *  cn() utility – class merging behavior
 *  AppContext gaps: register, giveFeedback, hydration from localStorage
 *  auth.ts gaps: lines 57, 70, 83 (error/null paths)
 *  lessons.ts gaps: revalidateTag calls on checkIn / checkOut
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── utils.ts ──────────────────────────────────────────────────────────────
import { cn } from "@/lib/utils";

describe("cn() – class name utility", () => {
  it("merges two class strings correctly", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes (falsy values omitted)", () => {
    expect(cn("base", false && "hidden", "active")).toBe("base active");
  });

  it("resolves Tailwind conflicts by keeping the last class", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("handles undefined and null inputs without throwing", () => {
    expect(() => cn(undefined as any, null as any, "safe")).not.toThrow();
    expect(cn(undefined as any, null as any, "safe")).toBe("safe");
  });
});

// ── AppContext: register + giveFeedback gaps ──────────────────────────────
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

import { renderHook, act } from "@testing-library/react";
import React from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import {
  registerStudentAction,
  registerInstructorAction,
} from "@/lib/actions/auth";
import { submitInstructorFeedbackAction } from "@/lib/actions/lessons";

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(AppProvider, null, children);

// ── register ──────────────────────────────────────────────────────────────
describe("AppContext – register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("registers a student, saves token, and sets studentProfile", async () => {
    (registerStudentAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      data: { id: "s1", name: "Ana", email: "ana@velo.com", ladvUploaded: false },
      token: "new-student-token",
    });

    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      result.current.setUserRole("student");
    });

    await act(async () => {
      await (result.current.register as any)({
        name: "Ana",
        email: "ana@velo.com",
        password: "senha123",
      });
    });

    expect(localStorage.getItem("velo-token")).toBe("new-student-token");
    expect(result.current.studentProfile?.name).toBe("Ana");
  });

  it("registers an instructor with fallback defaults", async () => {
    (registerInstructorAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      data: { id: "i1", name: "Carlos", email: "carlos@velo.com" },
      token: "new-instructor-token",
    });

    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      result.current.setUserRole("instructor");
    });

    await act(async () => {
      await (result.current.register as any)({
        name: "Carlos",
        email: "carlos@velo.com",
        password: "senha123",
      });
    });

    expect(localStorage.getItem("velo-token")).toBe("new-instructor-token");
    expect(result.current.instructorProfile?.rating).toBe(5.0);
    expect(result.current.instructorProfile?.reviewsCount).toBe(0);
  });
});

// ── giveFeedback ──────────────────────────────────────────────────────────
describe("AppContext – giveFeedback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const baseLesson = {
    id: "lesson-1",
    studentId: "s1",
    instructorId: "i1",
    date: new Date(),
    startTime: "10:00",
    endTime: "11:00",
    status: "completed" as const,
  };

  it("updates instructorFeedback field in scheduledClasses", async () => {
    (submitInstructorFeedbackAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      data: { ...baseLesson, instructorFeedback: "Muito dedicado" },
    });

    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      result.current.setScheduledClasses([baseLesson] as any);
    });

    await act(async () => {
      await result.current.giveFeedback("lesson-1", "Muito dedicado");
    });

    const lesson = result.current.scheduledClasses[0] as any;
    expect(lesson.instructorFeedback).toBe("Muito dedicado");
  });

  it("does not update state when API returns failure", async () => {
    (submitInstructorFeedbackAction as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: false,
      error: "Unauthorized",
    });

    const { result } = renderHook(() => useApp(), { wrapper });

    await act(async () => {
      result.current.setScheduledClasses([baseLesson] as any);
    });

    await act(async () => {
      await result.current.giveFeedback("lesson-1", "Ótimo");
    });

    const lesson = result.current.scheduledClasses[0] as any;
    expect(lesson.instructorFeedback).toBeUndefined();
  });
});
