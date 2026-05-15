"use client";
import { useEffect, useState } from "react";
import {
  getMyMedicalExam,
  scheduleMedicalExam,
  uploadMedicalLaudo,
  downloadMedicalProtocol,
  ClinicExamStatus,
} from "@/lib/api/stages";
import { useClinicCatalog } from "@/hooks/useClinicCatalog";
import { useInvalidateJourney } from "@/hooks/useJourney";
import { ClinicCard } from "@/components/journey/ClinicCard";
import { DocumentUploader } from "@/components/journey/DocumentUploader";
import { ProtocolPdfDownload } from "@/components/journey/ProtocolPdfDownload";
import { Button } from "@/components/ui/button";
import type { Clinic } from "@/lib/api/clinics";
import { Stethoscope } from "lucide-react";

export default function MedicalExamPage() {
  const catalog = useClinicCatalog("MEDICAL");
  const invalidate = useInvalidateJourney();
  const [selected, setSelected] = useState<Clinic | null>(null);
  const [date, setDate] = useState<string>("");
  const [status, setStatus] = useState<ClinicExamStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getMyMedicalExam().then(setStatus).catch(() => undefined);
  }, []);

  async function handleSchedule() {
    if (!selected || !date) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await scheduleMedicalExam({
        clinicId: selected.id,
        scheduledAt: new Date(date).toISOString(),
      });
      setStatus(updated);
      await invalidate();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao agendar.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const updated = await uploadMedicalLaudo(file);
      setStatus(updated);
      await invalidate();
    } catch (e: any) {
      setError(e?.message ?? "Erro no upload.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
      <header className="flex items-start gap-3">
        <Stethoscope className="mt-1 h-7 w-7 text-blue-600" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold">Exame médico</h1>
          <p className="text-sm text-zinc-600">
            Escolha uma clínica credenciada em Campo Grande/MS, agende,
            compareça e envie o laudo APTO.
          </p>
        </div>
      </header>

      {status?.laudoStatus === "APPROVED" ? (
        <section className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800">
          Laudo médico aprovado ✓
        </section>
      ) : (
        <>
          <section>
            <h2 className="mb-2 text-base font-semibold">
              Clínicas disponíveis
            </h2>
            {catalog.isLoading && <p className="text-sm">Carregando…</p>}
            {catalog.isError && (
              <p className="text-sm text-rose-600">
                Falha ao carregar clínicas.
              </p>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(catalog.data ?? []).map((c) => (
                <ClinicCard
                  key={c.id}
                  clinic={c}
                  selected={selected?.id === c.id}
                  onSelect={setSelected}
                />
              ))}
            </div>
          </section>

          {selected && (
            <section className="rounded-xl border border-zinc-200 bg-white p-4">
              <h2 className="text-base font-semibold">Agendamento</h2>
              <label className="mt-2 flex flex-col gap-1 text-sm">
                Data e hora
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                />
              </label>
              <Button
                onClick={handleSchedule}
                disabled={busy || !date}
                className="mt-3"
              >
                {busy ? "Agendando…" : "Confirmar agendamento"}
              </Button>
            </section>
          )}

          {status?.scheduledAt && (
            <section className="rounded-xl border border-zinc-200 bg-white p-4">
              <h2 className="text-base font-semibold">Enviar laudo APTO</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Agendado para{" "}
                {new Date(status.scheduledAt).toLocaleString("pt-BR")}.
              </p>
              <div className="mt-3">
                <DocumentUploader
                  label="Enviar laudo (PDF/JPG/PNG)"
                  onFile={handleUpload}
                />
              </div>
            </section>
          )}
        </>
      )}

      <section>
        <ProtocolPdfDownload
          fetcher={downloadMedicalProtocol}
          filename="protocolo-medico.pdf"
        />
      </section>

      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
    </main>
  );
}
