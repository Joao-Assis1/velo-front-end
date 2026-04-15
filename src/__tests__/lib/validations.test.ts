/**
 * 🔴 RED → 🟢 GREEN → 🔵 REFACTOR
 * Tests: validations/index.ts (Zod schemas)
 *
 * Covers:
 *  LessonSchema          – valid data, missing required fields, invalid status
 *  CreateLessonSchema    – valid data, missing studentId
 *  StudentSchema         – valid data, invalid email, name too short
 *  InstructorSchema      – valid data, rating out of range
 */

import { describe, it, expect } from "vitest";
import {
  LessonSchema,
  CreateLessonSchema,
  StudentSchema,
  InstructorSchema,
} from "@/lib/validations";

describe("Zod Schemas – data validation", () => {
  // LessonSchema ────────────────────────────────────────────────────────────
  describe("LessonSchema", () => {
    const validLesson = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      studentId: "550e8400-e29b-41d4-a716-446655440001",
      instructorId: "instructor-123",
      date: "2025-06-10T10:00:00.000Z",
      startTime: "10:00",
      endTime: "11:00",
      status: "upcoming" as const,
    };

    it("parses a valid lesson object successfully", () => {
      const result = LessonSchema.safeParse(validLesson);
      expect(result.success).toBe(true);
    });

    it("coerces the date string into a Date object", () => {
      const result = LessonSchema.safeParse(validLesson);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.date).toBeInstanceOf(Date);
    });

    it("rejects an invalid status value", () => {
      const invalid = { ...validLesson, status: "pending" };
      const result = LessonSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects when required id is missing", () => {
      const { id: _, ...noId } = validLesson;
      const result = LessonSchema.safeParse(noId);
      expect(result.success).toBe(false);
    });

    it("accepts all valid lesson statuses", () => {
      const statuses = ["upcoming", "in-progress", "completed", "cancelled"];
      statuses.forEach((status) => {
        const result = LessonSchema.safeParse({ ...validLesson, status });
        expect(result.success).toBe(true);
      });
    });
  });

  // CreateLessonSchema ──────────────────────────────────────────────────────
  describe("CreateLessonSchema", () => {
    const validCreate = {
      studentId: "550e8400-e29b-41d4-a716-446655440001",
      instructorId: "instructor-123",
      date: "2025-06-10",
      startTime: "10:00",
      endTime: "11:00",
    };

    it("parses a valid create lesson DTO", () => {
      const result = CreateLessonSchema.safeParse(validCreate);
      expect(result.success).toBe(true);
    });

    it("rejects when studentId is not a valid UUID", () => {
      const result = CreateLessonSchema.safeParse({
        ...validCreate,
        studentId: "not-a-uuid",
      });
      expect(result.success).toBe(false);
    });

    it("allows optional vehicleId to be omitted", () => {
      const result = CreateLessonSchema.safeParse(validCreate);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.vehicleId).toBeUndefined();
    });

    it("rejects when price is not positive", () => {
      const result = CreateLessonSchema.safeParse({
        ...validCreate,
        price: -50,
      });
      expect(result.success).toBe(false);
    });
  });

  // StudentSchema ───────────────────────────────────────────────────────────
  describe("StudentSchema", () => {
    const validStudent = {
      name: "Ana Costa",
      email: "ana@velo.com",
    };

    it("parses a valid student object", () => {
      const result = StudentSchema.safeParse(validStudent);
      expect(result.success).toBe(true);
    });

    it("defaults ladvUploaded to false when not provided", () => {
      const result = StudentSchema.safeParse(validStudent);
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.ladvUploaded).toBe(false);
    });

    it("rejects when name is shorter than 2 characters", () => {
      const result = StudentSchema.safeParse({ ...validStudent, name: "A" });
      expect(result.success).toBe(false);
    });

    it("rejects an invalid email format", () => {
      const result = StudentSchema.safeParse({
        ...validStudent,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
    });
  });

  // InstructorSchema ────────────────────────────────────────────────────────
  describe("InstructorSchema", () => {
    const validInstructor = {
      id: "instructor-1",
      name: "Carlos Silva",
    };

    it("parses a minimal instructor with default rating and reviewsCount", () => {
      const result = InstructorSchema.safeParse(validInstructor);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.rating).toBe(0);
        expect(result.data.reviewsCount).toBe(0);
      }
    });

    it("rejects rating above 5", () => {
      const result = InstructorSchema.safeParse({ ...validInstructor, rating: 6 });
      expect(result.success).toBe(false);
    });

    it("rejects negative reviewsCount", () => {
      const result = InstructorSchema.safeParse({
        ...validInstructor,
        reviewsCount: -1,
      });
      expect(result.success).toBe(false);
    });

    it("accepts valid transmission types", () => {
      ["Manual", "Automatic"].forEach((transmission) => {
        const result = InstructorSchema.safeParse({
          ...validInstructor,
          transmission,
        });
        expect(result.success).toBe(true);
      });
    });
  });
});
