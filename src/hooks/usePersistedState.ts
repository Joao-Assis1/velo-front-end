"use client";

import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";

/**
 * useState that mirrors its value into sessionStorage, so multi-step forms
 * survive same-tab navigation (e.g. opening Termos/Privacidade and coming back)
 * without resetting what the user already filled in. Cleared via
 * clearPersistedState once the flow completes.
 */
export function usePersistedState<T>(
  key: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.sessionStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  // Avoid re-writing storage on the very first render with the initial value.
  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    try {
      window.sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      // storage unavailable / quota exceeded — persistence is best-effort
    }
  }, [key, state]);

  return [state, setState];
}

export function clearPersistedState(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}
