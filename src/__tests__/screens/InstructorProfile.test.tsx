import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { InstructorProfileView } from "@/components/screens/student/InstructorProfile";

const instructor = {
  id: "inst-1",
  name: "Carlos Souza",
  phone: "67999998888",
  rating: 4.9,
  reviewsCount: 32,
  pricePerClass: 90,
  location: "Campo Grande - MS",
  bio: "Instrutor experiente",
  instructorType: "Autônomo",
  cnhNumber: "12345678901",
  profilePicture: "",
  transmission: "Manual",
  vehicleModel: "VW Polo",
  availability: [],
  busySlots: [],
} as any;

function renderProfile() {
  return render(
    <InstructorProfileView
      instructor={instructor}
      onBack={() => {}}
      hasLadv={true}
      hasPaymentMethod={true}
      onUploadLadv={() => {}}
      onAddPaymentMethod={() => {}}
      onBookClass={vi.fn()}
      busySlots={{}}
    />,
  );
}

describe("InstructorProfileView — agendamento", () => {
  it("não exibe o botão 'Conversar via WhatsApp'", () => {
    renderProfile();
    expect(screen.queryByText(/Conversar via WhatsApp/i)).toBeNull();
  });

  it("mantém a ação de agendar a aula", () => {
    renderProfile();
    expect(screen.getAllByText(/Selecione data e horário|Agendar para/i).length).toBeGreaterThan(0);
  });
});
