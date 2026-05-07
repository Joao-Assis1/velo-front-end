import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/context/AppContext";

// Mocking server actions to prevent real calls
vi.mock("@/lib/actions/lessons", () => ({
  getLessonsAction: vi.fn().mockResolvedValue({ success: true, data: [] }),
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

vi.mock("@/lib/actions/instructors", () => ({
  getInstructorsAction: vi.fn().mockResolvedValue({ success: true, data: [] }),
}));

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Import pages
import HomePage from "@/app/page";
import LoginPage from "@/app/auth/login/page";
import RegisterPage from "@/app/auth/register/page";
import InstructorDashboardPage from "@/app/app/instructor/dashboard/page";
import StudentAcademyPage from "@/app/app/student/academy/page";
import StudentDashboardPage from "@/app/app/student/dashboard/page";
import StudentInstructorsPage from "@/app/app/student/instructors/page";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>{children}</AppProvider>
  </QueryClientProvider>
);

describe("Smoke Testing - All Pages", () => {
  it("renders Landing Page without crashing", () => {
    const { container } = render(<HomePage />, { wrapper });
    expect(container).toBeDefined();
  });

  it("renders Login Page without crashing", () => {
    const { container } = render(<LoginPage />, { wrapper });
    expect(container).toBeDefined();
  });

  it("renders Register Page without crashing", () => {
    const { container } = render(<RegisterPage />, { wrapper });
    expect(container).toBeDefined();
  });

  it("renders Instructor Dashboard without crashing", () => {
    const { container } = render(<InstructorDashboardPage />, { wrapper });
    expect(container).toBeDefined();
  });

  it("renders Student Academy without crashing", () => {
    const { container } = render(<StudentAcademyPage />, { wrapper });
    expect(container).toBeDefined();
  });

  it("renders Student Dashboard without crashing", () => {
    const { container } = render(<StudentDashboardPage />, { wrapper });
    expect(container).toBeDefined();
  });

  it("renders Student Instructors without crashing", () => {
    const { container } = render(<StudentInstructorsPage />, { wrapper });
    expect(container).toBeDefined();
  });
});
