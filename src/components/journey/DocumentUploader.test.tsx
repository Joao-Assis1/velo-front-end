import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DocumentUploader } from "./DocumentUploader";

describe("DocumentUploader", () => {
  it("rejeita arquivo > 10 MB", async () => {
    const onFile = vi.fn();
    render(<DocumentUploader onFile={onFile} label="Enviar laudo" />);
    const input = screen.getByLabelText(/Enviar laudo/i) as HTMLInputElement;
    const big = new File(["x".repeat(11 * 1024 * 1024)], "big.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(input, { target: { files: [big] } });
    expect(
      await screen.findByText(/Arquivo maior que 10 MB/i),
    ).toBeInTheDocument();
    expect(onFile).not.toHaveBeenCalled();
  });

  it("rejeita mime inválido", async () => {
    const onFile = vi.fn();
    render(<DocumentUploader onFile={onFile} label="Enviar laudo" />);
    const input = screen.getByLabelText(/Enviar laudo/i) as HTMLInputElement;
    const txt = new File(["x"], "doc.txt", { type: "text/plain" });
    fireEvent.change(input, { target: { files: [txt] } });
    expect(await screen.findByText(/Tipo inválido/i)).toBeInTheDocument();
    expect(onFile).not.toHaveBeenCalled();
  });

  it("dispara onFile para PDF válido", async () => {
    const onFile = vi.fn();
    render(<DocumentUploader onFile={onFile} label="Enviar laudo" />);
    const input = screen.getByLabelText(/Enviar laudo/i) as HTMLInputElement;
    const ok = new File(["x"], "ok.pdf", { type: "application/pdf" });
    fireEvent.change(input, { target: { files: [ok] } });
    expect(onFile).toHaveBeenCalledWith(ok);
  });
});
