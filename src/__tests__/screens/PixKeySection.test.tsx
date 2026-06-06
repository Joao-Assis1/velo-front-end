import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { InstructorSettings } from "@/components/screens/instructor/Settings";

// Mock useApp
const mockSetInstructorProfile = vi.fn();
const mockInstructorProfile = {
  id: "inst-1",
  name: "Carlos",
  email: "carlos@test.com",
  rating: 5,
  reviewsCount: 0,
  pixKeyType: undefined as any,
  pixKey: undefined as any,
};

vi.mock("@/context/AppContext", () => ({
  useApp: () => ({
    instructorProfile: mockInstructorProfile,
    setInstructorProfile: mockSetInstructorProfile,
  }),
}));

vi.mock("@/lib/actions/auth", () => ({
  forgotPasswordAction: vi.fn(),
  resetPasswordAction: vi.fn(),
}));

const mockUpdateInstructorProfileAction = vi.fn();
vi.mock("@/lib/actions/instructors", () => ({
  updateInstructorProfileAction: (...args: any[]) =>
    mockUpdateInstructorProfileAction(...args),
}));

function renderSettings() {
  return render(<InstructorSettings onBack={() => {}} />);
}

describe("PixKeySection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInstructorProfile.pixKey = undefined as any;
    mockInstructorProfile.pixKeyType = undefined as any;
  });

  it("exibe 'Não cadastrada' quando não há chave PIX", () => {
    renderSettings();
    expect(screen.getByText("Não cadastrada")).toBeTruthy();
  });

  it("exibe botão 'Cadastrar' quando não há chave PIX", () => {
    renderSettings();
    expect(screen.getByRole("button", { name: /Cadastrar/i })).toBeTruthy();
  });

  it("abre formulário de edição ao clicar em Cadastrar", async () => {
    renderSettings();
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    await waitFor(() => {
      expect(screen.getByText("Chave PIX para Recebimentos")).toBeTruthy();
    });
  });

  it("mostra erro se salvar sem preencher campos", async () => {
    renderSettings();
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    await waitFor(() => screen.getByText("Chave PIX para Recebimentos"));
    fireEvent.click(screen.getByRole("button", { name: /^Salvar$/i }));
    await waitFor(() => {
      expect(screen.getByText("Selecione o tipo e informe a chave PIX.")).toBeTruthy();
    });
  });

  it("chama updateInstructorProfileAction com pixKeyType e pixKey ao salvar", async () => {
    mockUpdateInstructorProfileAction.mockResolvedValue({ success: true });
    renderSettings();

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    await waitFor(() => screen.getByText("Chave PIX para Recebimentos"));

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "CPF" } });
    fireEvent.change(screen.getByPlaceholderText("Digite sua chave PIX"), {
      target: { value: "123.456.789-00" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^Salvar$/i }));

    await waitFor(() => {
      expect(mockUpdateInstructorProfileAction).toHaveBeenCalledWith("inst-1", {
        pixKeyType: "CPF",
        pixKey: "123.456.789-00",
      });
    });
  });

  it("chama setInstructorProfile com os novos valores após salvar com sucesso", async () => {
    mockUpdateInstructorProfileAction.mockResolvedValue({ success: true });
    renderSettings();

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    await waitFor(() => screen.getByText("Chave PIX para Recebimentos"));

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "EMAIL" } });
    fireEvent.change(screen.getByPlaceholderText("Digite sua chave PIX"), {
      target: { value: "carlos@test.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^Salvar$/i }));

    await waitFor(() => {
      expect(mockSetInstructorProfile).toHaveBeenCalled();
    });
  });

  it("exibe erro retornado pela action quando salvar falha", async () => {
    mockUpdateInstructorProfileAction.mockResolvedValue({
      success: false,
      error: "Chave inválida.",
    });
    renderSettings();

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));
    await waitFor(() => screen.getByText("Chave PIX para Recebimentos"));

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "EVP" } });
    fireEvent.change(screen.getByPlaceholderText("Digite sua chave PIX"), {
      target: { value: "alguma-chave" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^Salvar$/i }));

    await waitFor(() => {
      expect(screen.getByText("Chave inválida.")).toBeTruthy();
    });
  });

  it("exibe chave PIX existente no modo de visualização", () => {
    mockInstructorProfile.pixKeyType = "EMAIL" as any;
    mockInstructorProfile.pixKey = "carlos@test.com" as any;
    renderSettings();
    expect(screen.getByText(/E-mail: carlos@test.com/)).toBeTruthy();
  });

  it("exibe botão 'Editar' quando há chave PIX cadastrada", () => {
    mockInstructorProfile.pixKeyType = "CPF" as any;
    mockInstructorProfile.pixKey = "123.456.789-00" as any;
    renderSettings();
    expect(screen.getByRole("button", { name: /Editar/i })).toBeTruthy();
  });
});
