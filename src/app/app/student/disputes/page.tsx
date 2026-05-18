"use client";

import { Scale } from "lucide-react";

export default function DisputesPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4">
      <header className="flex items-start gap-3">
        <Scale className="mt-1 h-7 w-7 text-blue-600" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold">Disputas</h1>
          <p className="text-sm text-zinc-600">
            Contestações relacionadas às suas aulas
          </p>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Scale className="mb-4 h-12 w-12 text-zinc-200" aria-hidden />
        <p className="text-base font-medium text-zinc-500">Nenhuma disputa aberta</p>
        <p className="mt-1 text-sm text-zinc-400">
          Disputas sobre aulas podem ser abertas pelo histórico de pagamentos.
        </p>
      </div>
    </main>
  );
}
