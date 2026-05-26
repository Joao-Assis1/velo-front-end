"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { fetchWrapper } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RefreshCcw, Send } from "lucide-react";

export default function DisputeDetailPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = params.lessonId;
  const sp = useSearchParams();
  const openedAt = sp.get("openedAt") ?? "—";
  const reason = sp.get("reason") ?? "—";
  const paymentStatus = sp.get("paymentStatus") ?? "—";
  const [resolved, setResolved] = useState(false);
  const [resolution, setResolution] = useState<"release" | "refund" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function resolve(action: "release" | "refund") {
    setBusy(true);
    setError(null);
    try {
      await fetchWrapper(`/payments-stripe/disputes/${lessonId}/resolve`, {
        method: "POST",
        body: JSON.stringify({ action }),
      });
      setResolved(true);
      setResolution(action);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao resolver disputa.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex w-full flex-col gap-6 p-4">
      <header className="flex items-start gap-3">
        <AlertOctagon className="mt-1 h-7 w-7 text-amber-600" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold">Disputa da aula</h1>
          <p className="text-sm text-zinc-600">
            Aula <code>{lessonId}</code>
          </p>
        </div>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 text-sm">
        <dl className="grid grid-cols-2 gap-2">
          <dt className="text-zinc-500">Pagamento</dt>
          <dd>{paymentStatus}</dd>
          <dt className="text-zinc-500">Aberta em</dt>
          <dd>
            {openedAt !== "—"
              ? new Date(openedAt).toLocaleString("pt-BR")
              : "—"}
          </dd>
          <dt className="text-zinc-500">Motivo</dt>
          <dd>{reason}</dd>
        </dl>
      </section>

      {resolved ? (
        <section className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-800">
          Disputa resolvida:{" "}
          {resolution === "release"
            ? "pagamento liberado ao instrutor"
            : "estorno solicitado ao aluno"}
          .
        </section>
      ) : (
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-base font-semibold">Resolução</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Apenas administradores enxergam estes botões.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button onClick={() => resolve("release")} disabled={busy}>
              <Send className="mr-1 h-4 w-4" aria-hidden />
              Liberar pagamento ao instrutor
            </Button>
            <Button
              variant="outline"
              onClick={() => resolve("refund")}
              disabled={busy}
            >
              <RefreshCcw className="mr-1 h-4 w-4" aria-hidden />
              Estornar para o aluno
            </Button>
          </div>
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
