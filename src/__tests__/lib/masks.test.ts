import { describe, it, expect } from "vitest";
import { maskPlate, isValidPlate } from "@/lib/utils/masks";

describe("Plate Masks & Validations", () => {
  describe("maskPlate", () => {
    it("formats traditional plates correctly", () => {
      expect(maskPlate("ABC1234")).toBe("ABC-1234");
    });

    it("formats Mercosul plates correctly", () => {
      expect(maskPlate("ABC1D23")).toBe("ABC-1D23");
    });

    it("handles lowercase input", () => {
      expect(maskPlate("abc1234")).toBe("ABC-1234");
    });

    it("limits length to 8 characters", () => {
      expect(maskPlate("ABC123456")).toBe("ABC-1234");
    });

    it("removes invalid characters", () => {
      expect(maskPlate("ABC-1234!")).toBe("ABC-1234");
    });
  });

  describe("isValidPlate", () => {
    it("validates traditional plates", () => {
      expect(isValidPlate("ABC-1234")).toBe(true);
      expect(isValidPlate("XYZ-9999")).toBe(true);
    });

    it("validates Mercosul plates", () => {
      expect(isValidPlate("ABC-1D23")).toBe(true);
      expect(isValidPlate("BRA-0S22")).toBe(true);
    });

    it("rejects invalid formats", () => {
      expect(isValidPlate("AB-1234")).toBe(false);
      expect(isValidPlate("ABCD-123")).toBe(false);
      expect(isValidPlate("ABC1234")).toBe(false); // Missing dash
      expect(isValidPlate("ABC-123")).toBe(false);
      expect(isValidPlate("ABC-12345")).toBe(false);
      expect(isValidPlate("123-ABCD")).toBe(false);
    });
  });
});
