"use client";
import { useEffect, useState } from "react";
import {
  declareOfficialTheory,
  getMyOfficialTheory,
  uploadOfficialTheoryProof,
  OfficialTheoryStatus,
} from "@/lib/api/stages";
import { useInvalidateJourney } from "@/hooks/useJourney";
import { DocumentUploader } from "@/components/journey/DocumentUploader";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export default function TheoryOfficialPage() {
  const invalidate = useInvalidateJourney();
  const [status, setStatus] = useState<OfficialTheoryStatus | null>(null);
  const [approved, setApproved] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getMyOfficialTheory().then(setStatus).catch(() => undefined);
  }, []);

  async function handleDeclare() {
    if (approved === null) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await declareOfficialTheory({ approved });
      setStatus(updated);
      await invalidate();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao declarar resultado.");
    } finally {
      setBusy(false);
    }
  }

  async function handleProof(file: File) {
    setBusy(true);
    setError(null);
    try {
      const updated = await uploadOfficialTheoryProof(file);
      setStatus(updated);
      await invalidate();
    } catch (e: any) {
      setError(e?.message ?? "Erro no upload.");
    } finally {
      setBusy(false);
    }
  }

  const already = status?.approved === true;

  return (
    <main className="flex w-full flex-col gap-6 p-4">
      <header className="flex items-start gap-3">
        <GraduationCap className="mt-1 h-7 w-7 text-blue-600" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold">Exame teórico oficial</h1>
          <p className="text-sm text-zinc-600">
            Após fazer o exame teórico oficial no posto DETRAN-MS, registre o
            resultado e anexe o comprovante.
          </p>
        </div>
      </header>

      {already ? (
        <section className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800">
          Aprovação registrada em{" "}
          {status?.declaredAt
            ? new Date(status.declaredAt).toLocaleString("pt-BR")
            : "—"}
          . Próximo passo: enviar sua LADV.
        </section>
      ) : (
        <>
          <section className="rounded-xl border border-zinc-200 bg-white p-4">
            <h2 className="text-base font-semibold">Resultado</h2>
            <div className="mt-2 flex gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="approved"
                  value="yes"
                  onChange={() => setApproved(true)}
                />
                Aprovado
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="approved"
                  value="no"
                  onChange={() => setApproved(false)}
                />
                Reprovado
              </label>
            </div>
            <Button
              className="mt-3"
              onClick={handleDeclare}
              disabled={busy || approved === null}
            >
              {busy ? "Enviando…" : "Confirmar declaração"}
            </Button>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-4">
            <h2 className="text-base font-semibold">
              Comprovante do DETRAN (opcional, mas recomendado)
            </h2>
            <div className="mt-2">
              <DocumentUploader
                label="Anexar comprovante (PDF/JPG/PNG)"
                onFile={handleProof}
              />
            </div>
          </section>
        </>
      )}

      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
    </main>
  );
}
