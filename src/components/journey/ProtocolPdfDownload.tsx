"use client";
import { FileDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ProtocolPdfDownload({
  fetcher,
  filename = "protocolo.pdf",
  label = "Baixar protocolo PDF",
  disabled = false,
}: {
  fetcher: () => Promise<Blob>;
  filename?: string;
  label?: string;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    try {
      const blob = await fetcher();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant="outline" onClick={download} disabled={busy || disabled}>
      <FileDown className="mr-1 h-4 w-4" aria-hidden />
      {busy ? "Gerando…" : label}
    </Button>
  );
}
