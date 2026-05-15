"use client";
import { useState, useEffect } from "react";
import { isPushSupported, registerPushSubscription } from "@/lib/push";
import { subscribeToPush } from "@/lib/api/journey";

export type PushStatus = "idle" | "requesting" | "granted" | "denied" | "unsupported";

export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>("idle");

  useEffect(() => {
    if (!isPushSupported()) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "granted") setStatus("granted");
    else if (Notification.permission === "denied") setStatus("denied");
  }, []);

  async function subscribe() {
    if (!isPushSupported()) return;
    setStatus("requesting");
    try {
      const sub = await registerPushSubscription();
      if (!sub) {
        setStatus("denied");
        return;
      }
      await subscribeToPush(sub.toJSON());
      setStatus("granted");
    } catch {
      setStatus("denied");
    }
  }

  return { status, subscribe };
}
