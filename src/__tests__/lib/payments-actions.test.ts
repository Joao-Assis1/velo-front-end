import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/api-client", () => ({
  fetchWrapper: vi.fn(),
}));

import { getStudentPaymentsAction, getPaymentByIdAction } from "@/lib/actions/payments";
import { fetchWrapper } from "@/lib/api-client";

const mockFetch = fetchWrapper as ReturnType<typeof vi.fn>;

const STUDENT_ID = "stu-1";
const PAYMENT_ID = "pay-1";

const samplePayment = {
  id: PAYMENT_ID,
  studentId: STUDENT_ID,
  amount: 120,
  status: "HELD",
  lessonId: "lesson-1",
};

describe("getStudentPaymentsAction", () => {
  it("calls GET /payments?studentId= and returns data on success", async () => {
    mockFetch.mockResolvedValueOnce({ data: [samplePayment] });

    const result = await getStudentPaymentsAction(STUDENT_ID);

    expect(mockFetch).toHaveBeenCalledWith(`/payments?studentId=${STUDENT_ID}`);
    expect(result).toEqual({ success: true, data: [samplePayment] });
  });

  it("returns { success: false, error } when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Não autorizado"));

    const result = await getStudentPaymentsAction(STUDENT_ID);

    expect(result).toEqual({ success: false, error: "Não autorizado" });
  });
});

describe("getPaymentByIdAction", () => {
  it("calls GET /payments/:id and returns data on success", async () => {
    mockFetch.mockResolvedValueOnce({ data: samplePayment });

    const result = await getPaymentByIdAction(PAYMENT_ID);

    expect(mockFetch).toHaveBeenCalledWith(`/payments/${PAYMENT_ID}`);
    expect(result).toEqual({ success: true, data: samplePayment });
  });

  it("returns { success: false, error } when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Pagamento não encontrado"));

    const result = await getPaymentByIdAction(PAYMENT_ID);

    expect(result).toEqual({ success: false, error: "Pagamento não encontrado" });
  });

  it("returns success: false with undefined error when exception has no message", async () => {
    mockFetch.mockRejectedValueOnce({});

    const result = await getPaymentByIdAction(PAYMENT_ID);

    expect(result.success).toBe(false);
  });
});
