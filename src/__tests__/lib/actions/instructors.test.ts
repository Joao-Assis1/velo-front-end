/**
 * 🔴 RED → 🟢 GREEN → 🔵 REFACTOR
 * Tests: instructors actions (instructors.ts) – was at 0% coverage
 *
 * Covers:
 *  getInstructorsAction – success with full mapping, empty array, API error
 *  Mapping of: vehicles, availabilities, optional fields
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/api-client", () => ({
  fetchWrapper: vi.fn(),
}));

import { fetchWrapper } from "@/lib/api-client";
import { getInstructorsAction } from "@/lib/actions/instructors";

// ── fixtures ──────────────────────────────────────────────────────────────
const rawInstructor = {
  id: "instructor-1",
  name: "Carlos Silva",
  profilePicture: "https://img.test/carlos.jpg",
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
      plate: "ABC-1234",
      year: "2020",
      transmission: "Manual",
    },
  ],
  availabilities: [
    {
      dayOfWeek: 1,
      startTime: "08:00",
      endTime: "12:00",
      isEnabled: true,
    },
  ],
};

describe("instructors actions", () => {
  beforeEach(() => vi.clearAllMocks());

  // getInstructorsAction ────────────────────────────────────────────────────
  describe("getInstructorsAction", () => {
    it("returns a mapped list of instructors on success", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: [rawInstructor],
      });

      const result = await getInstructorsAction();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });

    it("maps primary vehicle fields correctly", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: [rawInstructor],
      });

      const result = await getInstructorsAction();

      const instructor = result.data![0];
      expect(instructor.vehicleModel).toBe("Gol");
      expect(instructor.vehiclePlate).toBe("ABC-1234");
      expect(instructor.vehicleYear).toBe("2020");
      expect(instructor.transmission).toBe("Manual");
    });

    it("maps availability array correctly", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: [rawInstructor],
      });

      const result = await getInstructorsAction();

      const availability = result.data![0].availability!;
      expect(availability).toHaveLength(1);
      expect(availability[0]).toMatchObject({
        dayOfWeek: 1,
        startTime: "08:00",
        endTime: "12:00",
        isEnabled: true,
      });
    });

    it("handles instructor with no vehicles (undefined primaryVehicle)", async () => {
      const noVehicle = { ...rawInstructor, vehicles: [] };
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: [noVehicle],
      });

      const result = await getInstructorsAction();

      const instructor = result.data![0];
      expect(instructor.vehicleModel).toBeUndefined();
      expect(instructor.vehiclePlate).toBeUndefined();
      expect(instructor.transmission).toBeUndefined();
    });

    it("handles instructor with no availabilities", async () => {
      const noAvail = { ...rawInstructor, availabilities: undefined };
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: [noAvail],
      });

      const result = await getInstructorsAction();

      expect(result.data![0].availability).toEqual([]);
    });

    it("returns an empty array when API returns empty list", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue({
        success: true,
        data: [],
      });

      const result = await getInstructorsAction();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(0);
    });

    it("fetches from /instructors endpoint with next cache tags", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockResolvedValue([]);

      await getInstructorsAction();

      const [url, options] = (fetchWrapper as ReturnType<typeof vi.fn>).mock
        .calls[0];
      expect(url).toBe("/instructors");
      expect(options.next.tags).toContain("instructors");
    });

    it("returns { success: false } when API throws", async () => {
      (fetchWrapper as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error("Service unavailable"),
      );

      const result = await getInstructorsAction();

      expect(result.success).toBe(false);
      expect(result.error).toBe("Service unavailable");
    });
  });
});
