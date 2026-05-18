import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React, { useEffect } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import InstructorMarketplace from "@/app/app/student/instructors/page";
import VeloAcademy from "@/app/app/student/academy/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AcademyModule } from "@/types";

// Mock server actions
vi.mock("@/lib/actions/instructors", () => ({
  getInstructorsAction: vi.fn().mockResolvedValue({
    success: true,
    data: [
      { id: "1", name: "Instrutor A", pricePerClass: 100, location: "Centro", rating: 4.5, reviewsCount: 10, instructorType: "Credenciado" },
      { id: "2", name: "Instrutor B", pricePerClass: 150, location: "Norte", rating: 4.8, reviewsCount: 20, instructorType: "Autônomo" },
    ],
  }),
  updateInstructorProfileAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/lib/actions/lessons", () => ({
  getLessonsAction: vi.fn().mockResolvedValue({ success: true, data: [] }),
  cancelLessonAction: vi.fn().mockResolvedValue({ success: true }),
  createLessonAction: vi.fn(),
  checkInAction: vi.fn(),
  checkOutAction: vi.fn(),
  submitStudentFeedbackAction: vi.fn(),
  submitInstructorFeedbackAction: vi.fn(),
}));

vi.mock("@/lib/actions/auth", () => ({
  loginStudentAction: vi.fn(),
  loginInstructorAction: vi.fn(),
  registerStudentAction: vi.fn(),
  registerInstructorAction: vi.fn(),
}));

vi.mock("@/lib/actions/payments", () => ({
  processPaymentAction: vi.fn().mockResolvedValue({ success: true }),
  getStudentPaymentsAction: vi.fn().mockResolvedValue({ success: true, data: [] }),
  getPaymentByIdAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/lib/actions/academy", () => ({
  getAcademyModulesAction: vi.fn().mockResolvedValue({ success: true, data: [] }),
  seedAcademyAction: vi.fn().mockResolvedValue({ success: true }),
  submitAcademyScoreAction: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("@/lib/actions/profileActions", () => ({
  getStudentProfileAction: vi.fn().mockResolvedValue({ success: true }),
  updateStudentProfileAction: vi.fn().mockResolvedValue({ success: true }),
}));

const mockAcademyModules: AcademyModule[] = [
  {
    id: "m1",
    title: "Legislação de Trânsito",
    description: "Módulo de legislação",
    duration: "30 min",
    progress: 0,
    isLocked: false,
    questions: [
      {
        id: "q1",
        text: "Qual a velocidade máxima em área urbana?",
        options: [
          { id: "a", text: "30 km/h" },
          { id: "b", text: "40 km/h" },
          { id: "c", text: "60 km/h" },
          { id: "d", text: "80 km/h" },
        ],
        correctOptionId: "a",
      },
    ],
  },
];

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>{children}</AppProvider>
  </QueryClientProvider>
);

// Wrapper that pre-populates academyModules in context
const SetAcademyModules = ({ modules }: { modules: AcademyModule[] }) => {
  const { setAcademyModules } = useApp();
  useEffect(() => {
    setAcademyModules(modules);
  }, []);
  return null;
};

const wrapperWithAcademy = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <SetAcademyModules modules={mockAcademyModules} />
      {children}
    </AppProvider>
  </QueryClientProvider>
);

describe("Navigator Integration Flows", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe("Instructor Marketplace", () => {
    it("filters instructors by name", async () => {
      render(<InstructorMarketplace />, { wrapper });

      expect(await screen.findByText("Instrutor A")).toBeDefined();
      expect(screen.getByText("Instrutor B")).toBeDefined();

      const searchInput = screen.getByPlaceholderText(/nome, bairro ou cidade/i);

      fireEvent.change(searchInput, { target: { value: "Instrutor A" } });

      expect(screen.getByText("Instrutor A")).toBeDefined();
      expect(screen.queryByText("Instrutor B")).toBeNull();
    });

    it("filters instructors by price", async () => {
      render(<InstructorMarketplace />, { wrapper });

      expect(await screen.findByText("Instrutor A")).toBeDefined();

      const priceSlider = screen.getAllByRole("slider")[0];

      fireEvent.change(priceSlider, { target: { value: "120" } });

      expect(screen.getByText("Instrutor A")).toBeDefined();
      expect(screen.queryByText("Instrutor B")).toBeNull();
    });
  });

  describe("Velo Academy & Quiz Flow", () => {
    it("calculates quiz score correctly and shows results", async () => {
      render(<VeloAcademy />, { wrapper: wrapperWithAcademy });

      const moduleCard = await screen.findByText("Legislação de Trânsito");
      fireEvent.click(moduleCard);

      const quizTabButton = await screen.findByText("Simulado");
      fireEvent.click(quizTabButton);

      const optionA = await screen.findByText("30 km/h");
      fireEvent.click(optionA);

      const confirmButton = screen.getByText("Confirmar Resposta");
      fireEvent.click(confirmButton);

      const resultButton = await screen.findByText("Ver Resultado");
      fireEvent.click(resultButton);

      expect(await screen.findByText(/Parabéns! Você passou!/i)).toBeDefined();
      expect(screen.getByText(/Você acertou 1 de 1 questões \(100%\)/i)).toBeDefined();
    });

    it("handles incorrect answers and shows failing result", async () => {
      render(<VeloAcademy />, { wrapper: wrapperWithAcademy });

      const moduleCard = await screen.findByText("Legislação de Trânsito");
      fireEvent.click(moduleCard);

      const quizTabButton = await screen.findByText("Simulado");
      fireEvent.click(quizTabButton);

      const optionB = await screen.findByText("40 km/h");
      fireEvent.click(optionB);

      fireEvent.click(screen.getByText("Confirmar Resposta"));

      const resultButton = await screen.findByText("Ver Resultado");
      fireEvent.click(resultButton);

      expect(await screen.findByText(/Não foi desta vez.../i)).toBeDefined();
      expect(screen.getByText(/Você acertou 0 de 1 questões \(0%\)/i)).toBeDefined();
    });
  });
});
