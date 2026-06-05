"use client";
import { useEffect, useState } from "react";
import {
  listCards,
  deleteCard,
  setDefaultCard,
  SavedCard,
} from "@/lib/api/payments-stripe";
import { AddCardForm } from "@/components/features/AddCardForm";
import { Button } from "@/components/ui/button";
import { CreditCard, Trash2, Star } from "lucide-react";

function friendlyError(e: unknown, fallback: string): string {
  const msg = (e as any)?.message ?? "";
  if (/unauthorized|401/i.test(msg)) return "Sessão expirada. Faça login novamente.";
  return msg || fallback;
}

export default function PaymentsPage() {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function reload() {
    try {
      setCards(await listCards());
    } catch (e: unknown) {
      setError(friendlyError(e, "Erro ao carregar cartões."));
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  async function handleDelete(id: string) {
    setBusy(true);
    try {
      await deleteCard(id);
      await reload();
    } catch (e: unknown) {
      setError(friendlyError(e, "Erro ao remover cartão."));
    } finally {
      setBusy(false);
    }
  }

  async function handleDefault(id: string) {
    setBusy(true);
    try {
      await setDefaultCard(id);
      await reload();
    } catch (e: unknown) {
      setError(friendlyError(e, "Erro ao definir padrão."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex w-full flex-col gap-6 p-4">
      <header className="flex items-start gap-3">
        <CreditCard className="mt-1 h-7 w-7 text-blue-600" aria-hidden />
        <div>
          <h1 className="text-2xl font-bold">Métodos de pagamento</h1>
          <p className="text-sm text-zinc-600">
            Cartões são salvos com segurança. A Velo não armazena
            número, CVV ou validade.
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-3">
        {cards.length === 0 && (
          <p className="text-sm text-zinc-500">Nenhum cartão salvo ainda.</p>
        )}
        {cards.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-zinc-500" aria-hidden />
              <div>
                <p className="text-sm font-medium">
                  {c.brand.toUpperCase()} •••• {c.last4}
                </p>
                <p className="text-xs text-zinc-500">
                  Validade {String(c.expiryMonth).padStart(2, "0")}/
                  {String(c.expiryYear).slice(-2)}
                  {c.isDefault && " · padrão"}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {!c.isDefault && (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={busy}
                  onClick={() => handleDefault(c.id)}
                  aria-label="Definir como padrão"
                >
                  <Star className="h-4 w-4" aria-hidden />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                disabled={busy}
                onClick={() => handleDelete(c.id)}
                aria-label="Remover cartão"
              >
                <Trash2 className="h-4 w-4 text-rose-600" aria-hidden />
              </Button>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4">
        <h2 className="text-base font-semibold">Adicionar novo cartão</h2>
        <div className="mt-3">
          <AddCardForm onSuccess={() => void reload()} />
        </div>
      </section>

      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
    </main>
  );
}
