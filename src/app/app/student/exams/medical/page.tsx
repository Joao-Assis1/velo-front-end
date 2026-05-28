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
import { maskDate, maskTime } from "@/lib/utils/masks";
import { brDateToISO } from "@/lib/utils/dates";

export default function MedicalExamPage() {
  const catalog = useClinicCatalog("MEDICAL");
  const invalidate = useInvalidateJourney();
  const [selected, setSelected] = useState<Clinic | null>(null);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [status, setStatus] = useState<ClinicExamStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [laudoResult, setLaudoResult] = useState<
    "APTO" | "INAPTO" | "APTO_COM_RESTRICOES"
  >("APTO");
  const [laudoValidUntil, setLaudoValidUntil] = useState<string>("");

  useEffect(() => {
    getMyMedicalExam().then(setStatus).catch(() => undefined);
  }, []);

  async function handleSchedule() {
    if (!selected || !date || !time) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await scheduleMedicalExam({
        clinicId: selected.id,
        scheduledAt: new Date(`${brDateToISO(date)}T${time}`).toISOString(),
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
    if (!laudoValidUntil) return;
    setBusy(true);
    setError(null);
    try {
      const updated = await uploadMedicalLaudo(
        file,
        laudoResult,
        new Date(laudoValidUntil),
      );
      setStatus(updated);
      await invalidate();
    } catch (e: any) {
      setError(e?.message ?? "Erro no upload.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex w-full flex-col gap-6 p-4">
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

      {status?.status === "APPROVED" ? (
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
              <div className="mt-2 flex gap-3">
                <label className="flex flex-1 flex-col gap-1 text-sm">
                  Data
                  <input
                    value={date}
                    onChange={(e) => setDate(maskDate(e.target.value))}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    inputMode="numeric"
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="flex w-28 flex-col gap-1 text-sm">
                  Hora
                  <input
                    value={time}
                    onChange={(e) => setTime(maskTime(e.target.value))}
                    placeholder="HH:MM"
                    maxLength={5}
                    inputMode="numeric"
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <Button
                onClick={handleSchedule}
                disabled={busy || !date || !time}
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
                Agendado para {status.scheduledAt}.
              </p>
              <div className="mt-3 flex flex-col gap-3">
                <label className="flex flex-col gap-1 text-sm">
                  Resultado
                  <select
                    value={laudoResult}
                    onChange={(e) =>
                      setLaudoResult(
                        e.target.value as
                          | "APTO"
                          | "INAPTO"
                          | "APTO_COM_RESTRICOES",
                      )
                    }
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                  >
                    <option value="APTO">APTO</option>
                    <option value="INAPTO">INAPTO</option>
                    <option value="APTO_COM_RESTRICOES">
                      APTO com restrições
                    </option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Validade do laudo
                  <input
                    type="date"
                    value={laudoValidUntil}
                    onChange={(e) => setLaudoValidUntil(e.target.value)}
                    min={new Date().toISOString().slice(0, 10)}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                  />
                </label>
                <DocumentUploader
                  label="Enviar laudo (PDF/JPG/PNG)"
                  onFile={handleUpload}
                  disabled={busy || !laudoValidUntil}
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
          disabled={!status}
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
