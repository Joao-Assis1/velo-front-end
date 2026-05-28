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
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setBusy(true);
    setError(null);
    try {
      const blob = await fetcher();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao baixar protocolo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button variant="outline" onClick={download} disabled={busy || disabled}>
        <FileDown className="mr-1 h-4 w-4" aria-hidden />
        {busy ? "Gerando…" : label}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
