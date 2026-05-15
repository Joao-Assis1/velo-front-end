"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useInvalidateJourney } from "@/hooks/useJourney";
import {
  getMyRenach,
  getRenachGuide,
  submitMyRenach,
  RenachGuide,
  RenachStatus,
} from "@/lib/api/stages";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";

type FormShape = {
  renachNumber: string;
  ufDetran: string;
  biometryDoneAt: string;
};

export default function RenachPage() {
  const invalidate = useInvalidateJourney();
  const [guide, setGuide] = useState<RenachGuide | null>(null);
  const [status, setStatus] = useState<RenachStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, formState } = useForm<FormShape>({
    defaultValues: { ufDetran: "MS" },
  });

  useEffect(() => {
    let cancel = false;
    Promise.all([getRenachGuide("MS"), getMyRenach()])
      .then(([g, s]) => {
        if (!cancel) {
          setGuide(g);
          setStatus(s);
        }
      })
      .catch((e) => !cancel && setError(e?.message ?? "Erro ao carregar."));
    return () => {
      cancel = true;
    };
  }, []);

  async function onSubmit(values: FormShape) {
    setBusy(true);
    setError(null);
    try {
      const updated = await submitMyRenach(values);
      setStatus(updated);
      await invalidate();
    } catch (e: any) {
      setError(e?.message ?? "Erro ao enviar dados do RENACH.");
    } finally {
      setBusy(false);
    }
  }

  const alreadyDone = status?.status === "DONE";

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
      <header className="flex items-start gap-3">
        <FileText className="mt-1 h-7 w-7 text-blue-600" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold">Processo RENACH</h1>
          <p className="text-sm text-zinc-600">
            Abertura do processo no DETRAN-MS, biometria e captura de dados.
          </p>
        </div>
      </header>

      {guide && (
        <section className="rounded-xl border border-zinc-200 bg-white p-4">
          <h2 className="text-base font-semibold">
            Instruções para {guide.detranName}
          </h2>
          <ol className="ml-5 mt-2 list-decimal space-y-1 text-sm text-zinc-800">
            {guide.instructions.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
          <a
            href={guide.detranUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-blue-700 underline"
          >
            Abrir portal DETRAN-MS{" "}
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </section>
      )}

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold">
          Após fazer biometria, informe os dados
        </h2>
        {alreadyDone ? (
          <p className="mt-2 text-sm text-emerald-700">
            RENACH {status?.renachNumber} concluído em{" "}
            {status?.biometryDoneAt?.slice(0, 10)}.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-2 flex flex-col gap-3"
          >
            <label className="flex flex-col gap-1 text-sm">
              Número do RENACH
              <input
                {...register("renachNumber", { required: true, minLength: 6 })}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                placeholder="MS-000000000"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              UF do DETRAN
              <input
                {...register("ufDetran", { required: true, maxLength: 2 })}
                readOnly
                className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Data da biometria
              <input
                type="date"
                {...register("biometryDoneAt", { required: true })}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
            </label>
            <Button type="submit" disabled={busy || !formState.isValid}>
              {busy ? "Enviando…" : "Confirmar RENACH"}
            </Button>
          </form>
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm text-rose-600">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
