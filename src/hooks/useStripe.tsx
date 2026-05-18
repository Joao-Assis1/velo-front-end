"use client";
import { ReactNode, useMemo } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";

export function StripeProvider({
  clientSecret,
  children,
}: {
  clientSecret?: string;
  children: ReactNode;
}) {
  const stripePromise = useMemo(() => getStripe(), []);
  const options = clientSecret
    ? { clientSecret, appearance: { theme: "stripe" as const } }
    : undefined;
  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
