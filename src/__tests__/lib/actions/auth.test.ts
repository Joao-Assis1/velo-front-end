/**
 * Tests: auth actions (auth.ts)
 *
 * Covers:
 *  loginStudentAction      – success, invalid credentials, API error
 *  loginInstructorAction   – maps vehicles + availabilities correctly
 *  registerStudentAction   – success path
 *  registerInstructorAction – success path
 *
 * Note: next/headers cookies() is mocked globally in setup.ts
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// next/headers is mocked in setup.ts
vi.mock("@/lib/api-client", () => ({
  fetchWrapper: vi.fn(),
}));

import { fetchWrapper } from "@/lib/api-client";
import {
  loginStudentAction,
  loginInstructorAction,
  registerStudentAction,
  registerInstructorAction,
} from "@/lib/actions/auth";

// ── fixtures ──────────────────────────────────────────────────────────────
const studentAuthResponse = {
  success: true,
  message: "Operação realizada com sucesso",
  data: {
    access_token: "student-jwt",
    user: {
      id: "student-1",
      name: "Ana Costa",
      email: "ana@velo.com",
      ladvUploaded: true,
      profilePicture: null,
      phone: "11999999999",
      cpf: "000.000.000-00",
    },
  },
};

const instructorAuthResponse = {
  success: true,
  message: "Operação realizada com sucesso",
  data: {
    access_token: "instructor-jwt",
    user: {
      id: "instructor-1",
      name: "Carlos Silva",
      email: "carlos@velo.com",
      profilePicture: null,
      rating: 4.8,
      reviewsCount: 22,
      pricePerClass: 120,
      location: "São Paulo",
      bio: "Instrutor experiente",
      instructorType: "Credenciado",
      vehicles: [
        {
          id: "vehicle-1",
          model: "Gol",
          transmission: "Manual",
          plate: "ABC-1234",
          year: "2020",
        },
      ],
      availabilities: [
        {
          id: "avail-1",
          dayOfWeek: 1,
          startTime: "08:00",
          endTime: "12:00",
          isEnabled: true,
        },
      ],
    },
  },
};

// ── suite ─────────────────────────────────────────────────────────────────
describe("auth actions", () => {
  beforeEach(() => vi.clearAllMocks());

  // loginStudentAction ──────────────────────────────────────────────────────
  describe("loginStudentAction", () => {
    it("returns success with user and token on valid credentials", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue(
        studentAuthResponse,
      );

      const result = await loginStudentAction({
        email: "ana@velo.com",
        password: "senha123",
      });

      expect(result.success).toBe(true);
      expect(result.token).toBe("student-jwt");
      expect(result.data).toMatchObject({
        id: "student-1",
        name: "Ana Costa",
        email: "ana@velo.com",
      });
    });

    it("returns { success: false } when API returns no user", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: false,
        message: "Invalid credentials",
        data: {
          access_token: null,
          user: null,
        },
      });

      const result = await loginStudentAction({
        email: "x@x.com",
        password: "wrong",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Credenciais inválidas");
    });

    it("catches and returns error message when fetch throws", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Timeout"),
      );

      const result = await loginStudentAction({
        email: "x@x.com",
        password: "x",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Timeout");
    });
  });

  // loginInstructorAction ───────────────────────────────────────────────────
  describe("loginInstructorAction", () => {
    it("maps vehicle and availability data correctly", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue(
        instructorAuthResponse,
      );

      const result = await loginInstructorAction({
        email: "carlos@velo.com",
        password: "senha123",
      });

      expect(result.success).toBe(true);
      expect(result.token).toBe("instructor-jwt");
      expect(result.data).toMatchObject({
        id: "instructor-1",
        name: "Carlos Silva",
        vehicleId: "vehicle-1",
        vehicleModel: "Gol",
        transmission: "Manual",
      });
      expect((result.data as any).availability).toHaveLength(1);
      expect((result.data as any).availability[0]).toMatchObject({
        dayOfWeek: 1,
        startTime: "08:00",
        isEnabled: true,
      });
    });

    it("handles instructor with no vehicles gracefully", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        message: "Operação realizada com sucesso",
        data: {
          access_token: "instructor-jwt",
          user: {
            id: "instructor-1",
            name: "Carlos Silva",
            email: "carlos@velo.com",
            profilePicture: null,
            rating: 4.8,
            reviewsCount: 22,
            pricePerClass: 120,
            location: "São Paulo",
            bio: "Instrutor experiente",
            instructorType: "Credenciado",
            vehicles: [],
            availabilities: [],
          },
        },
      });

      const result = await loginInstructorAction({
        email: "carlos@velo.com",
        password: "senha123",
      });

      expect(result.success).toBe(true);
      expect((result.data as any).vehicleId).toBeUndefined();
      expect((result.data as any).availability).toHaveLength(0);
    });
  });

  // registerStudentAction ───────────────────────────────────────────────────
  describe("registerStudentAction", () => {
    it("returns success with user data and token", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue(
        studentAuthResponse,
      );

      const result = await registerStudentAction({
        name: "Ana Costa",
        email: "ana@velo.com",
        password: "senha123",
      });

      expect(result.success).toBe(true);
      expect(result.token).toBe("student-jwt");
    });

    it("returns { success: false } when API returns no user", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: false,
        message: "Registration failed",
        data: {
          access_token: null,
          user: null,
        },
      });

      const result = await registerStudentAction({
        name: "Ana",
        email: "ana@velo.com",
        password: "senha123",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  // registerInstructorAction ────────────────────────────────────────────────
  describe("registerInstructorAction", () => {
    it("returns success with instructor data", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue(
        instructorAuthResponse,
      );

      const result = await registerInstructorAction({
        name: "Carlos Silva",
        email: "carlos@velo.com",
        password: "senha123",
      });

      expect(result.success).toBe(true);
      expect(result.token).toBe("instructor-jwt");
    });

    it("returns { success: false } when fetch throws", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Email já cadastrado"),
      );

      const result = await registerInstructorAction({
        name: "Carlos",
        email: "carlos@velo.com",
        password: "senha123",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Email já cadastrado");
    });
  });
});
