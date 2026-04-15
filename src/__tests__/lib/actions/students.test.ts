/**
 * 🔴 RED → 🟢 GREEN → 🔵 REFACTOR
 * Tests: students actions (students.ts) – was at 0% coverage
 *
 * Covers:
 *  createStudentAction – success, error
 *  getStudentAction    – success, student not found, API error
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { revalidateTag } from "next/cache";

vi.mock("@/lib/api-client", () => ({
  fetchWrapper: vi.fn(),
}));

import { fetchWrapper } from "@/lib/api-client";
import { createStudentAction, getStudentAction } from "@/lib/actions/students";

const mockStudentRaw = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "Ana Costa",
  email: "ana@velo.com",
  phone: "11999999999",
  cpf: "000.000.000-00",
  profilePicture: null,
  ladvUploaded: false,
};

const createDto = {
  name: "Ana Costa",
  email: "ana@velo.com",
  ladvUploaded: false,
};

describe("students actions", () => {
  beforeEach(() => vi.clearAllMocks());

  // createStudentAction ─────────────────────────────────────────────────────
  describe("createStudentAction", () => {
    it("returns the created student and calls revalidateTag", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: mockStudentRaw,
      });

      const result = await createStudentAction(createDto);

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({ name: "Ana Costa" });
      expect(revalidateTag).toHaveBeenCalledWith("students", "default");
    });

    it("posts to /students with the correct body", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: mockStudentRaw,
      });

      await createStudentAction(createDto);

      const [url, options] = (fetchWrapper as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toBe("/students");
      expect(options.method).toBe("POST");
      expect(JSON.parse(options.body)).toMatchObject({ name: "Ana Costa" });
    });

    it("returns { success: false } when API throws", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Email já cadastrado"),
      );

      const result = await createStudentAction(createDto);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Email já cadastrado");
    });
  });

  // getStudentAction ────────────────────────────────────────────────────────
  describe("getStudentAction", () => {
    it("returns the student data on success", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: mockStudentRaw,
      });

      const result = await getStudentAction("student-1");

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({ name: "Ana Costa" });
    });

    it("fetches the correct endpoint with student id", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: mockStudentRaw,
      });

      await getStudentAction("student-abc");

      const [url] = (fetchWrapper as ReturnType<typeof vi.fn>).mock.calls[0];
      expect(url).toBe("/students/student-abc");
    });

    it("returns { success: false } when student is not found (null response)", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: null,
      });

      const result = await getStudentAction("nonexistent");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Student not found");
    });

    it("returns { success: false } when API throws", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Network error"),
      );

      const result = await getStudentAction("student-1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network error");
    });
  });
});
