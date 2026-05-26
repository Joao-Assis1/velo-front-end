"use client";
import { useState } from "react";
import { useJourney, useInvalidateJourney } from "@/hooks/useJourney";
import { startTheoryCourse } from "@/lib/api/stages";
import { Button } from "@/components/ui/button";
import { ExternalLink, BookOpen } from "lucide-react";

const APP_CNH_BRASIL = "https://www.gov.br/transportes/pt-br/cnh-do-brasil";

export default function TheoryCoursePage() {
  const journey = useJourney();
  const invalidate = useInvalidateJourney();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const alreadyStarted =
    journey.data?.stage &&
    journey.data.stage !== "REGISTERED" &&
    journey.data.stage !== "THEORY_COURSE_IN_PROGRESS";

  const started = journey.data?.stage === "THEORY_COURSE_IN_PROGRESS";

  async function handleStart() {
    setBusy(true);
    setError(null);
    try {
      await startTheoryCourse();
      await invalidate();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao registrar início do curso.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex w-full flex-col gap-6 p-4">
      <header className="flex items-start gap-3">
        <BookOpen className="mt-1 h-7 w-7 text-blue-600" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold">Curso teórico oficial</h1>
          <p className="text-sm text-zinc-600">
            Conforme Resolução CONTRAN 1.020/2025, o curso teórico é feito
            integralmente pelo app oficial CNH do Brasil (gov.br/MinTrans).
          </p>
        </div>
      </header>

      <ol className="ml-5 list-decimal space-y-2 text-sm text-zinc-800">
        <li>Baixe o app oficial CNH do Brasil na loja do seu celular.</li>
        <li>Faça login com sua conta gov.br nível ouro/prata.</li>
        <li>Conclua os módulos teóricos no próprio app (45 horas mínimas).</li>
        <li>
          Ao terminar, volte aqui e clique em <strong>"Já comecei"</strong> para
          liberar a próxima etapa.
        </li>
      </ol>

      <a
        href={APP_CNH_BRASIL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 underline"
      >
        Saiba mais sobre o app oficial{" "}
        <ExternalLink className="h-4 w-4" aria-hidden />
      </a>

      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        {started ? (
          <p className="text-sm text-emerald-700">
            Você marcou o curso teórico como iniciado. Próximo passo: abrir o
            processo RENACH no DETRAN-MS.
          </p>
        ) : alreadyStarted ? (
          <p className="text-sm text-zinc-600">Você já avançou desta etapa.</p>
        ) : (
          <Button onClick={handleStart} disabled={busy}>
            {busy ? "Registrando…" : "Já comecei o curso teórico"}
          </Button>
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm text-rose-600">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
