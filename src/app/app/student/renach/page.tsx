"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useInvalidateJourney } from "@/hooks/useJourney";
import {
  getMyRenach,
  submitMyRenach,
  RenachStatus,
} from "@/lib/api/stages";
import { maskDate } from "@/lib/utils/masks";
import { brDateToISO } from "@/lib/utils/dates";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle } from "lucide-react";

type FormShape = {
  renachNumber: string;
  ufDetran: string;
  biometryDoneAt: string;
};

export default function RenachPage() {
  const invalidate = useInvalidateJourney();
  const [status, setStatus] = useState<RenachStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [biometryDisplay, setBiometryDisplay] = useState("");
  const { register, handleSubmit, formState, setValue } = useForm<FormShape>({
    defaultValues: { ufDetran: "MS" },
  });

  useEffect(() => {
    let cancel = false;
    getMyRenach().then(
      (data) => {
        if (cancel) return;
        setStatus(data);
      },
      (reason) => {
        if (cancel) return;
        const msg: string = reason?.message ?? "";
        if (!/not found|404/i.test(msg))
          setError(msg || "Erro ao carregar dados do RENACH.");
      },
    );
    return () => {
      cancel = true;
    };
  }, []);

  async function onSubmit(values: FormShape) {
    setBusy(true);
    setError(null);
    try {
      const updated = await submitMyRenach({
        ...values,
        biometryDoneAt: brDateToISO(values.biometryDoneAt),
      });
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
    <main className="flex w-full flex-col gap-6 p-4">
      <header className="flex items-start gap-3">
        <FileText className="mt-1 h-7 w-7 text-blue-600" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold">Processo RENACH</h1>
          <p className="text-sm text-zinc-600">
            Abertura do processo de habilitação no DETRAN-MS. Faça isso após
            concluir o curso teórico.
          </p>
        </div>
      </header>

      <section className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        <div className="text-sm text-amber-800">
          <p className="font-semibold">Exame toxicológico obrigatório</p>
          <p className="mt-0.5">
            Categorias A e B exigem exame toxicológico com resultado negativo
            (Lei 15.153/2025). Realize em laboratório credenciado antes da
            emissão da sua Permissão para Dirigir.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold">Como abrir o processo no DETRAN-MS</h2>
        <ol className="ml-5 mt-2 list-decimal space-y-2 text-sm text-zinc-800">
          <li>
            <strong>Pague a taxa de serviço</strong> — cobrada pelo DETRAN-MS no
            momento da abertura do processo
          </li>
          <li>
            <strong>Faça o agendamento</strong> — pelo site do DETRAN-MS ou
            ligue para o 0800 do DETRAN
          </li>
          <li>
            <strong>Compareça no dia marcado</strong> — com RG, CPF e
            comprovante de residência, para coleta de dados, biometria facial
            e digitais. O DETRAN indicará a clínica para os exames obrigatórios
          </li>
        </ol>
      </section>

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
                placeholder="MS000000000"
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
                value={biometryDisplay}
                onChange={(e) => {
                  const masked = maskDate(e.target.value);
                  setBiometryDisplay(masked);
                  setValue("biometryDoneAt", masked, { shouldValidate: true });
                }}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                inputMode="numeric"
                className="rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              />
              <input type="hidden" {...register("biometryDoneAt", { required: true, minLength: 10 })} />
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
