import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NextStepCard } from "./NextStepCard";

describe("NextStepCard", () => {
  it("renderiza título e CTA para THEORY_COURSE_PENDING", () => {
    render(
      <NextStepCard
        blockers={[{ code: "THEORY_COURSE_PENDING", message: "" }]}
      />,
    );
    expect(screen.getByText(/Inicie o curso teórico/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Ir para curso teórico/i }),
    ).toHaveAttribute("href", "/app/student/theory-course");
  });

  it("renderiza estado terminal quando não há blockers e stage é READY", () => {
    render(
      <NextStepCard blockers={[]} stage="READY_FOR_PRACTICAL_EXAM" />,
    );
    expect(
      screen.getByText(/Pronto para o exame DETRAN/i),
    ).toBeInTheDocument();
  });
});
