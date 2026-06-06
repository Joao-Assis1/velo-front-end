/**
 * 🔴 RED → 🟢 GREEN → 🔵 REFACTOR
 * Tests: lessons actions (lessons.ts)
 *
 * Strategy: mock fetchWrapper so we test only the mapping / business logic
 * inside each action, NOT the HTTP layer (tested separately).
 *
 * Covers:
 *  getLessonsAction   – happy path, API error
 *  createLessonAction – maps returned lesson, calls revalidateTag
 *  checkInAction      – maps dates correctly
 *  checkOutAction     – maps dates correctly
 *  submitStudentFeedbackAction  – passes rating + text
 *  submitInstructorFeedbackAction – passes feedback string
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { revalidateTag } from "next/cache";

// ── mock api-client ───────────────────────────────────────────────────────
vi.mock("@/lib/api-client", () => ({
  fetchWrapper: vi.fn(),
}));

import { fetchWrapper } from "@/lib/api-client";
import {
  getLessonsAction,
  createLessonAction,
  checkInAction,
  checkOutAction,
  submitStudentFeedbackAction,
  submitInstructorFeedbackAction,
} from "@/lib/actions/lessons";

// ── fixtures ──────────────────────────────────────────────────────────────
const rawLesson = {
  id: "lesson-1",
  studentId: "student-1",
  instructorId: "instructor-1",
  instructor: { name: "Carlos" },
  student: { name: "Ana", profilePicture: "https://img.test/a.jpg" },
  date: "2025-06-10T10:00:00.000Z",
  startTime: "10:00",
  endTime: "11:00",
  status: "upcoming",
  price: 80,
  studentFeedbackRating: null,
  studentFeedbackText: null,
  instructorFeedback: null,
  checkInTime: null,
  checkOutTime: null,
  durationMinutes: null,
};

const mappedLesson = {
  id: "lesson-1",
  studentId: "student-1",
  instructorId: "instructor-1",
  instructorName: "Carlos",
  studentName: "Ana",
  studentImage: "https://img.test/a.jpg",
  date: new Date(2025, 5, 10, 12, 0, 0),
  startTime: "10:00",
  endTime: "11:00",
  status: "upcoming",
  price: 80,
};

// ── suite ─────────────────────────────────────────────────────────────────
describe("lessons actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // getLessonsAction ────────────────────────────────────────────────────────
  describe("getLessonsAction", () => {
    it("returns mapped lessons on success", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: [rawLesson],
      });

      const result = await getLessonsAction({ studentId: "student-1" });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.data![0]).toMatchObject(mappedLesson);
    });

    it("builds correct query string with studentId filter", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: [],
      });

      await getLessonsAction({ studentId: "student-42" });

      const [url] = (fetchWrapper as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toContain("studentId=student-42");
    });

    it("returns { success: false } when API throws", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Network down"),
      );

      const result = await getLessonsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network down");
    });
  });

  // createLessonAction ──────────────────────────────────────────────────────
  describe("createLessonAction", () => {
    it("maps the created lesson and calls revalidateTag", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: rawLesson,
      });

      const dto = {
        studentId: "student-1",
        instructorId: "instructor-1",
        date: "2025-06-10",
        startTime: "10:00",
        endTime: "11:00",
      };

      const result = await createLessonAction(dto);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject(mappedLesson);
      expect(revalidateTag).toHaveBeenCalledWith("lessons", "default");
    });

    it("returns error when creation fails", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Conflict"),
      );

      const result = await createLessonAction({
        studentId: "s1",
        instructorId: "i1",
        date: "2025-06-10",
        startTime: "10:00",
        endTime: "11:00",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Conflict");
    });
  });

  // checkInAction ───────────────────────────────────────────────────────────
  describe("checkInAction", () => {
    it("maps checkInTime as a Date object", async () => {
      const checkInRaw = {
        ...rawLesson,
        status: "in-progress",
        checkInTime: "2025-06-10T10:05:00.000Z",
      };
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: checkInRaw,
      });

      const result = await checkInAction("lesson-1");

      expect(result.success).toBe(true);
      expect(result.data?.checkInTime).toBeInstanceOf(Date);
      expect(result.data?.status).toBe("in-progress");
    });
  });

  // checkOutAction ──────────────────────────────────────────────────────────
  describe("checkOutAction", () => {
    it("maps checkOutTime as a Date object and includes duration", async () => {
      const checkOutRaw = {
        ...rawLesson,
        status: "completed",
        checkInTime: "2025-06-10T10:05:00.000Z",
        checkOutTime: "2025-06-10T11:05:00.000Z",
        durationMinutes: 60,
      };
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: checkOutRaw,
      });

      const result = await checkOutAction("lesson-1");

      expect(result.success).toBe(true);
      expect(result.data?.checkOutTime).toBeInstanceOf(Date);
      expect(result.data?.durationMinutes).toBe(60);
    });
  });

  // submitStudentFeedbackAction ─────────────────────────────────────────────
  describe("submitStudentFeedbackAction", () => {
    it("sends the correct rating and text payload", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: {
          ...rawLesson,
          studentFeedbackRating: 5,
          studentFeedbackText: "Ótimo!",
        },
      });

      const result = await submitStudentFeedbackAction("lesson-1", 5, "Ótimo!");

      expect(result.success).toBe(true);
      const [, options] = (fetchWrapper as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(JSON.parse(options.body)).toEqual({ rating: 5, text: "Ótimo!" });
    });
  });

  // submitInstructorFeedbackAction ──────────────────────────────────────────
  describe("submitInstructorFeedbackAction", () => {
    it("sends the feedback string in the request body", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: {
          ...rawLesson,
          instructorFeedback: "Aluno atencioso",
        },
      });

      const result = await submitInstructorFeedbackAction(
        "lesson-1",
        "Aluno atencioso",
      );

      expect(result.success).toBe(true);
      const [, options] = (fetchWrapper as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(JSON.parse(options.body)).toEqual({ feedback: "Aluno atencioso" });
    });
  });
});
