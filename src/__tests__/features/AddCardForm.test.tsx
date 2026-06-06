import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddCardForm } from "@/components/features/AddCardForm";

vi.mock("@/context/AppContext", () => ({
  useApp: () => ({ studentProfile: { id: "stu-1" } }),
}));

vi.mock("@/lib/actions/payment-methods", () => ({
  addPaymentMethodAction: vi.fn(),
}));

import { addPaymentMethodAction } from "@/lib/actions/payment-methods";

const mockAdd = addPaymentMethodAction as ReturnType<typeof vi.fn>;

function fillForm(overrides: Partial<{ name: string; number: string; expiry: string; cvv: string }> = {}) {
  const { name = "JOAO SILVA", number = "4111 1111 1111 1111", expiry = "12/27", cvv = "123" } = overrides;
  fireEvent.change(screen.getByPlaceholderText(/COMO ESTÁ NO CARTÃO/i), { target: { name: "cardholderName", value: name } });
  fireEvent.change(screen.getByPlaceholderText(/0000 0000/), { target: { name: "cardNumber", value: number } });
  fireEvent.change(screen.getByPlaceholderText("MM/AA"), { target: { name: "expiryDate", value: expiry } });
  fireEvent.change(screen.getByPlaceholderText("123"), { target: { name: "cvv", value: cvv } });
}

describe("AddCardForm", () => {
  beforeEach(() => {
    mockAdd.mockReset();
  });

  it("renders all fields and submit button", () => {
    render(<AddCardForm />);
    expect(screen.getByPlaceholderText(/COMO ESTÁ NO CARTÃO/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/0000 0000/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("MM/AA")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("123")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /adicionar cartão/i })).toBeInTheDocument();
  });

  it("calls addPaymentMethodAction with stripped card number and correct fields on submit", async () => {
    mockAdd.mockResolvedValue({ success: true });
    render(<AddCardForm />);
    fillForm();

    fireEvent.submit(screen.getByRole("button", { name: /adicionar cartão/i }).closest("form")!);

    await waitFor(() => {
      expect(mockAdd).toHaveBeenCalledOnce();
      const dto = mockAdd.mock.calls[0][0];
      expect(dto.cardNumber).toBe("4111111111111111"); // spaces stripped
      expect(dto.cardholderName).toBe("JOAO SILVA");
      expect(dto.expiryMonth).toBe("12");
      expect(dto.expiryYear).toBe("2027");
      expect(dto.cvv).toBe("123");
      expect(dto.studentId).toBe("stu-1");
      expect(dto.isDefault).toBe(true);
    });
  });

  it("calls onSuccess callback when action succeeds", async () => {
    mockAdd.mockResolvedValue({ success: true });
    const onSuccess = vi.fn();
    render(<AddCardForm onSuccess={onSuccess} />);
    fillForm();

    fireEvent.submit(screen.getByRole("button", { name: /adicionar cartão/i }).closest("form")!);

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
  });

  it("shows backend error message when action returns success: false", async () => {
    mockAdd.mockResolvedValue({ success: false, error: "Cartão recusado pela operadora" });
    render(<AddCardForm />);
    fillForm();

    fireEvent.submit(screen.getByRole("button", { name: /adicionar cartão/i }).closest("form")!);

    await waitFor(() =>
      expect(screen.getByText("Cartão recusado pela operadora")).toBeInTheDocument()
    );
  });

  it("shows fallback error when action returns success: false with no error string", async () => {
    mockAdd.mockResolvedValue({ success: false });
    render(<AddCardForm />);
    fillForm();

    fireEvent.submit(screen.getByRole("button", { name: /adicionar cartão/i }).closest("form")!);

    await waitFor(() =>
      expect(screen.getByText(/cartão não autorizado/i)).toBeInTheDocument()
    );
  });

  it("shows connection error when action throws", async () => {
    mockAdd.mockRejectedValue(new Error("Network Error"));
    render(<AddCardForm />);
    fillForm();

    fireEvent.submit(screen.getByRole("button", { name: /adicionar cartão/i }).closest("form")!);

    await waitFor(() =>
      expect(screen.getByText(/erro de conexão/i)).toBeInTheDocument()
    );
  });

  it("shows expiry format error when date has no slash", async () => {
    render(<AddCardForm />);
    fillForm({ expiry: "12" }); // no slash → parts.length !== 2

    fireEvent.submit(screen.getByRole("button", { name: /adicionar cartão/i }).closest("form")!);

    await waitFor(() =>
      expect(screen.getByText(/formato de validade inválido/i)).toBeInTheDocument()
    );
    expect(mockAdd).not.toHaveBeenCalled();
  });

  it("renders Cancel button and calls onClose when clicked", () => {
    const onClose = vi.fn();
    render(<AddCardForm onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
