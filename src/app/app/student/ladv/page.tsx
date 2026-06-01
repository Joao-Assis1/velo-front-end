"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getLadvGuide,
  getMyLadv,
  submitLadvManual,
  uploadLadv,
  LadvStatus,
  LadvGuide,
} from "@/lib/api/stages";
import { useInvalidateJourney } from "@/hooks/useJourney";
import { DocumentUploader } from "@/components/journey/DocumentUploader";
import { Button } from "@/components/ui/button";
import { IdCard, PenLine, ChevronUp, ChevronDown, Smartphone, CalendarClock, Timer } from "lucide-react";
import { maskDate } from "@/lib/utils/masks";
import { brDateToISO } from "@/lib/utils/dates";

type ManualShape = {
  ladvNumber: string;
  ladvIssuedAt: string;
  ladvValidUntil: string;
};

export default function LadvPage() {
  const invalidate = useInvalidateJourney();
  const [guide, setGuide] = useState<LadvGuide | null>(null);
  const [status, setStatus] = useState<LadvStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [issuedDisplay, setIssuedDisplay] = useState("");
  const [validDisplay, setValidDisplay] = useState("");
  const { register, handleSubmit, formState, setValue } = useForm<ManualShape>();

  useEffect(() => {
    Promise.allSettled([getLadvGuide("MS"), getMyLadv()]).then(
      ([guideResult, statusResult]) => {
        if (guideResult.status === "fulfilled") setGuide(guideResult.value);
        if (statusResult.status === "fulfilled") setStatus(statusResult.value);
        if (statusResult.status === "rejected") {
          const msg: string = (statusResult.reason as any)?.message ?? "";
          if (!/not found|404/i.test(msg))
            setError(msg || "Erro ao carregar dados da LADV.");
        }
      },
    );
  }, []);

  async function handleUpload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const updated = await uploadLadv(file);
      setStatus(updated);
      await invalidate();
    } catch (e: any) {
      setError(e?.message ?? "Erro no upload.");
    } finally {
      setBusy(false);
    }
  }

  async function onManual(values: ManualShape) {
    setBusy(true);
    setError(null);
    try {
      const updated = await submitLadvManual({
        ...values,
        ladvIssuedAt: brDateToISO(values.ladvIssuedAt),
        ladvValidUntil: brDateToISO(values.ladvValidUntil),
      });
      setStatus(updated);
      await invalidate();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao enviar dados.");
    } finally {
      setBusy(false);
    }
  }

  const ocrLabel: Record<NonNullable<LadvStatus["ladvOcrStatus"]>, string> = {
    PASS: "Validada automaticamente",
    NEEDS_REVIEW: "Em revisão manual",
    FAIL: "OCR não reconheceu — envie novamente ou use entrada manual",
  };

  return (
    <main className="flex w-full flex-col gap-6 p-4">
      <header className="flex items-start gap-3">
        <IdCard className="mt-1 h-7 w-7 text-blue-600" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold">LADV — Licença de Aprendizagem</h1>
          <p className="text-sm text-zinc-600">
            A LADV é emitida via app CNH do Brasil após aprovação no exame
            teórico. Envie a versão digital aqui para liberar o agendamento de
            aulas práticas.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <Smartphone size={12} aria-hidden /> App CNH do Brasil
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <CalendarClock size={12} aria-hidden /> Válida por 12 meses
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <Timer size={12} aria-hidden /> Mínimo 2h de prática (nova regra)
            </span>
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold">Como emitir pelo app CNH do Brasil</h2>
        <ol className="ml-5 mt-2 list-decimal space-y-2 text-sm text-zinc-800">
          <li>Abra o app <strong>CNH do Brasil</strong></li>
          <li>Toque em <strong>Condutor</strong></li>
          <li>Selecione <strong>Primeira habilitação</strong></li>
          <li>Acesse <strong>Curso prático</strong></li>
          <li>Sua LADV estará disponível para emissão</li>
        </ol>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold">Status atual</h2>
        <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <dt className="text-zinc-500">Número</dt>
          <dd>{status?.ladvNumber ?? "—"}</dd>
          <dt className="text-zinc-500">Validade</dt>
          <dd>{status?.ladvValidUntil?.slice(0, 10) ?? "—"}</dd>
          <dt className="text-zinc-500">OCR</dt>
          <dd>
            {status?.ladvOcrStatus ? ocrLabel[status.ladvOcrStatus] : "—"}
          </dd>
        </dl>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold">Upload da LADV (PDF/JPG/PNG)</h2>
        <div className="mt-3">
          <DocumentUploader label="Enviar arquivo da LADV" onFile={handleUpload} />
        </div>
      </section>

      {status?.ladvOcrStatus !== "PASS" && (
      <section className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setManualOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-zinc-50 transition-colors"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
            <PenLine size={16} className="text-blue-600 shrink-0" />
            {manualOpen ? "Ocultar entrada manual" : "Não tenho o arquivo — preencher manualmente"}
          </span>
          {manualOpen
            ? <ChevronUp size={16} className="text-zinc-400 shrink-0" />
            : <ChevronDown size={16} className="text-zinc-400 shrink-0" />}
        </button>

        {manualOpen && (
          <form
            className="flex flex-col gap-3 px-4 pb-4 border-t border-zinc-100 pt-4"
            onSubmit={handleSubmit(onManual)}
          >
            <label className="flex flex-col gap-1 text-sm">
              Número da LADV
              <input
                {...register("ladvNumber", { required: true, minLength: 7, maxLength: 7, pattern: /^\d{7}$/ })}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                placeholder="Ex: 1234567"
                maxLength={7}
                inputMode="numeric"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Data de emissão
              <input
                value={issuedDisplay}
                onChange={(e) => {
                  const masked = maskDate(e.target.value);
                  setIssuedDisplay(masked);
                  setValue("ladvIssuedAt", masked, { shouldValidate: true });
                }}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                inputMode="numeric"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
              <input type="hidden" {...register("ladvIssuedAt", { required: true, minLength: 10 })} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Validade
              <input
                value={validDisplay}
                onChange={(e) => {
                  const masked = maskDate(e.target.value);
                  setValidDisplay(masked);
                  setValue("ladvValidUntil", masked, { shouldValidate: true });
                }}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                inputMode="numeric"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
              <input type="hidden" {...register("ladvValidUntil", { required: true, minLength: 10 })} />
            </label>
            <p className="text-xs text-zinc-500">
              Entrada manual fica em revisão (não libera aulas automaticamente).
            </p>
            <Button type="submit" disabled={busy || !formState.isValid}>
              {busy ? "Enviando…" : "Enviar dados para revisão"}
            </Button>
          </form>
        )}
      </section>
      )}

      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
    </main>
  );
}
