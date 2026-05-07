import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { AppProvider, useApp } from "@/context/AppContext";

// Mock server actions (needed for context hydration/initialization)
vi.mock("@/lib/actions/lessons", () => ({
  getLessonsAction: vi.fn().mockResolvedValue({ success: true, data: [] }),
  createLessonAction: vi.fn(),
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

const mockLesson = {
  id: "lesson-1",
  studentId: "student-1",
  instructorId: "instructor-1",
  date: new Date(),
  startTime: "10:00",
  endTime: "11:00",
  status: "upcoming" as const,
  price: 150.00
};

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(AppProvider, null, children);

describe("Instructor Class Flow (Integration)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("handles the complete class start-to-finish flow", async () => {
    const { result } = renderHook(() => useApp(), { wrapper });

    // 1. Initial State Check
    await act(async () => {
      result.current.setScheduledClasses([mockLesson]);
    });
    
    expect(result.current.activeClassId).toBe(null);
    expect(result.current.scheduledClasses[0].status).toBe('upcoming');
    const initialAvailable = result.current.availableBalance;
    const initialPending = result.current.pendingBalance;

    // 2. Start Class
    await act(async () => {
      result.current.startClass("lesson-1");
    });

    expect(result.current.activeClassId).toBe("lesson-1");
    expect(result.current.scheduledClasses[0].status).toBe('in-progress');

    // 3. Finish Class
    await act(async () => {
      result.current.finishClass("lesson-1");
    });

    expect(result.current.activeClassId).toBe(null);
    expect(result.current.scheduledClasses[0].status).toBe('completed');
    expect(result.current.scheduledClasses[0].durationMinutes).toBeGreaterThanOrEqual(0);

    // 4. Verify Financial Balance Update
    expect(result.current.availableBalance).toBe(initialAvailable + mockLesson.price);
    expect(result.current.pendingBalance).toBe(initialPending - mockLesson.price);
  });
});
