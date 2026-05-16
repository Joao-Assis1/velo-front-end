"use client";
import { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { createSetupIntent, attachCard } from "@/lib/api/payments-stripe";
import { Button } from "@/components/ui/button";

function InnerForm({ onDone }: { onDone: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);
    const { error: stripeError, setupIntent } = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
      confirmParams: { return_url: window.location.href },
    });
    if (stripeError) {
      setError(stripeError.message ?? "Falha ao salvar cartão.");
      setBusy(false);
      return;
    }
    const pmId =
      typeof setupIntent?.payment_method === "string"
        ? setupIntent.payment_method
        : setupIntent?.payment_method?.id;
    if (pmId) {
      try {
        await attachCard(pmId);
      } catch (e: any) {
        setError(
          e?.message ??
            "Cartão confirmado no Stripe mas falhou ao salvar localmente.",
        );
        setBusy(false);
        return;
      }
    }
    setBusy(false);
    onDone();
  }

  return (
    <div className="flex flex-col gap-3">
      <PaymentElement />
      <Button onClick={handleConfirm} disabled={busy}>
        {busy ? "Salvando…" : "Salvar cartão"}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function AddCardStripe({ onDone }: { onDone: () => void }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function start() {
    setError(null);
    try {
      const intent = await createSetupIntent();
      setClientSecret(intent.clientSecret);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao iniciar SetupIntent.");
    }
  }

  if (!clientSecret) {
    return (
      <div className="flex flex-col gap-2">
        <Button onClick={start}>Adicionar novo cartão</Button>
        {error && (
          <p role="alert" className="text-sm text-rose-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <Elements
      stripe={getStripe()}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <InnerForm onDone={onDone} />
    </Elements>
  );
}
