import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { JourneyStepper } from "./JourneyStepper";
import type { TimelineStep } from "@/lib/api/journey";

const steps: TimelineStep[] = [
  { key: "REGISTERED", label: "Cadastro", status: "completed" },
  {
    key: "THEORY_COURSE_IN_PROGRESS",
    label: "Curso teórico",
    status: "in_progress",
  },
  { key: "RENACH_PENDING", label: "RENACH", status: "upcoming" },
];

describe("JourneyStepper", () => {
  it("renderiza um nó por step", () => {
    render(<JourneyStepper steps={steps} />);
    expect(screen.getByText("Cadastro")).toBeInTheDocument();
    expect(screen.getByText("Curso teórico")).toBeInTheDocument();
    expect(screen.getByText("RENACH")).toBeInTheDocument();
  });

  it("marca step concluído com data-status=completed", () => {
    render(<JourneyStepper steps={steps} />);
    const completed = screen.getByTestId("step-REGISTERED");
    expect(completed.getAttribute("data-status")).toBe("completed");
  });

  it("marca step in_progress como aria-current=step", () => {
    render(<JourneyStepper steps={steps} />);
    const current = screen.getByTestId("step-THEORY_COURSE_IN_PROGRESS");
    expect(current.getAttribute("aria-current")).toBe("step");
  });
});
