import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ValidatedField } from "./ValidatedField";

describe("ValidatedField", () => {
  it("chama validate onBlur e exibe erro", async () => {
    const validate = vi.fn().mockResolvedValue("CPF inválido");
    render(<ValidatedField name="cpf" label="CPF" validate={validate} />);
    const input = screen.getByLabelText(/CPF/i);
    fireEvent.change(input, { target: { value: "111.111.111-11" } });
    fireEvent.blur(input);
    await waitFor(() =>
      expect(screen.getByText(/CPF inválido/)).toBeInTheDocument(),
    );
  });

  it("não exibe erro quando validate retorna null", async () => {
    const validate = vi.fn().mockResolvedValue(null);
    render(<ValidatedField name="cpf" label="CPF" validate={validate} />);
    const input = screen.getByLabelText(/CPF/i);
    fireEvent.change(input, { target: { value: "529.982.247-25" } });
    fireEvent.blur(input);
    await waitFor(() => expect(validate).toHaveBeenCalled());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
