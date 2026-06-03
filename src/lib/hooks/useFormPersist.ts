import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Persists form state in sessionStorage so navigation away (e.g. to Terms page)
 * and back does not reset the form.
 */
export function useFormPersist<T extends object>(key: string, initial: T) {
  const clearedRef = useRef(false);

  const [form, setFormState] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const stored = sessionStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    if (clearedRef.current) {
      clearedRef.current = false;
      return;
    }
    try {
      sessionStorage.setItem(key, JSON.stringify(form));
    } catch {
      // ignore storage errors (private browsing quota)
    }
  }, [key, form]);

  const setForm = useCallback((updater: T | ((prev: T) => T)) => {
    setFormState(updater);
  }, []);

  const clearForm = useCallback(() => {
    clearedRef.current = true;
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
    setFormState(initial);
  }, [key, initial]);

  return { form, setForm, clearForm };
}

