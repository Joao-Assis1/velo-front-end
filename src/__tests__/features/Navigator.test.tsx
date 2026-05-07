import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import InstructorMarketplace from "@/app/app/student/instructors/page";
import VeloAcademy from "@/app/app/student/academy/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock server actions
vi.mock("@/lib/actions/instructors", () => ({
  getInstructorsAction: vi.fn().mockResolvedValue({
    success: true,
    data: [
      { id: "1", name: "Instrutor A", pricePerClass: 100, location: "Centro", rating: 4.5, reviewsCount: 10, instructorType: "Credenciado" },
      { id: "2", name: "Instrutor B", pricePerClass: 150, location: "Norte", rating: 4.8, reviewsCount: 20, instructorType: "Autônomo" },
    ],
  }),
}));

vi.mock("@/lib/actions/lessons", () => ({
  getLessonsAction: vi.fn().mockResolvedValue({ success: true, data: [] }),
}));

vi.mock("@/lib/actions/auth", () => ({
  loginStudentAction: vi.fn(),
  loginInstructorAction: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>{children}</AppProvider>
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

      // Wait for loading to finish and data to appear
      expect(await screen.findByText("Instrutor A")).toBeDefined();
      expect(screen.getByText("Instrutor B")).toBeDefined();

      const searchInput = screen.getByPlaceholderText(/Buscar por nome/i);
      
      // Search for A
      fireEvent.change(searchInput, { target: { value: "Instrutor A" } });

      expect(screen.getByText("Instrutor A")).toBeDefined();
      expect(screen.queryByText("Instrutor B")).toBeNull();
    });

    it("filters instructors by price", async () => {
      render(<InstructorMarketplace />, { wrapper });

      expect(await screen.findByText("Instrutor A")).toBeDefined();

      const priceSlider = screen.getAllByRole("slider")[0];
      
      // Set price to 120
      fireEvent.change(priceSlider, { target: { value: "120" } });

      // Only Instrutor A (100) should be visible, Instrutor B (150) should be gone
      expect(screen.getByText("Instrutor A")).toBeDefined();
      expect(screen.queryByText("Instrutor B")).toBeNull();
    });
  });

  describe("Velo Academy & Quiz Flow", () => {
    it("calculates quiz score correctly and shows results", async () => {
      render(<VeloAcademy />, { wrapper });

      // Select a module with questions (m1)
      const moduleCard = screen.getByText("Legislação de Trânsito");
      fireEvent.click(moduleCard);

      // Navigate to Quiz
      const quizTabButton = await screen.findByText("Simulado");
      fireEvent.click(quizTabButton);

      // Answer first question correctly (Option A)
      const optionA = await screen.findByText("30 km/h");
      fireEvent.click(optionA);

      const confirmButton = screen.getByText("Confirmar Resposta");
      fireEvent.click(confirmButton);

      // Go to results (only one question in mock m1)
      const resultButton = await screen.findByText("Ver Resultado");
      fireEvent.click(resultButton);

      // Verify passing result (100%)
      expect(await screen.findByText(/Parabéns! Você passou!/i)).toBeDefined();
      expect(screen.getByText(/Você acertou 1 de 1 questões \(100%\)/i)).toBeDefined();
    });

    it("handles incorrect answers and shows failing result", async () => {
      render(<VeloAcademy />, { wrapper });

      const moduleCard = screen.getByText("Legislação de Trânsito");
      fireEvent.click(moduleCard);

      const quizTabButton = await screen.findByText("Simulado");
      fireEvent.click(quizTabButton);

      // Answer incorrectly (Option B)
      const optionB = await screen.findByText("40 km/h");
      fireEvent.click(optionB);

      fireEvent.click(screen.getByText("Confirmar Resposta"));
      
      const resultButton = await screen.findByText("Ver Resultado");
      fireEvent.click(resultButton);

      // Verify failing result (0%)
      expect(await screen.findByText(/Não foi desta vez.../i)).toBeDefined();
      expect(screen.getByText(/Você acertou 0 de 1 questões \(0%\)/i)).toBeDefined();
    });
  });
});
