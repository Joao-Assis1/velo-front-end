import { describe, it, expect, vi, beforeEach } from "vitest";
import { addPaymentMethodAction } from "@/lib/actions/payment-methods";

vi.mock("@/lib/api-client", () => ({
  fetchWrapper: vi.fn(),
}));

import { fetchWrapper } from "@/lib/api-client";

const mockFetch = fetchWrapper as ReturnType<typeof vi.fn>;

const baseDto = {
  studentId: "stu-123",
  cardholderName: "João Silva",
  cardNumber: "4111111111111111",
  expiryMonth: "12",
  expiryYear: "2027",
  cvv: "123",
  isDefault: true,
};

describe("addPaymentMethodAction", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("calls fetchWrapper with POST /payment-methods and correct payload", async () => {
    mockFetch.mockResolvedValueOnce({ data: { id: "pm-abc" } });

    await addPaymentMethodAction(baseDto);

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith("/payment-methods", {
      method: "POST",
      body: JSON.stringify(baseDto),
    });
  });

  it("returns { success: true, data } on success", async () => {
    const mockData = { id: "pm-abc", last4: "1111" };
    mockFetch.mockResolvedValueOnce({ data: mockData });

    const result = await addPaymentMethodAction(baseDto);

    expect(result).toEqual({ success: true, data: mockData });
  });

  it("returns { success: false, error } when fetchWrapper throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Dados do cartão inválidos"));

    const result = await addPaymentMethodAction(baseDto);

    expect(result).toEqual({ success: false, error: "Dados do cartão inválidos" });
  });

  it("returns { success: false, error: undefined } when error has no message", async () => {
    mockFetch.mockRejectedValueOnce({});

    const result = await addPaymentMethodAction(baseDto);

    expect(result.success).toBe(false);
  });
});
