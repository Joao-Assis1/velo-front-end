import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useFormPersist } from "./useFormPersist";

const KEY = "test-form";

interface TestForm {
  name: string;
  email: string;
  step: number;
}

const INITIAL: TestForm = { name: "", email: "", step: 1 };

describe("useFormPersist", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns initial state when sessionStorage is empty", () => {
    const { result } = renderHook(() => useFormPersist(KEY, INITIAL));
    expect(result.current.form).toEqual(INITIAL);
  });

  it("persists form changes to sessionStorage", () => {
    const { result } = renderHook(() => useFormPersist(KEY, INITIAL));

    act(() => {
      result.current.setForm((p) => ({ ...p, name: "João Silva" }));
    });

    const stored = JSON.parse(sessionStorage.getItem(KEY)!);
    expect(stored.name).toBe("João Silva");
  });

  it("restores form from sessionStorage on mount (simulates navigation back)", () => {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({ name: "Maria", email: "m@m.com", step: 2 })
    );

    const { result } = renderHook(() => useFormPersist(KEY, INITIAL));

    expect(result.current.form.name).toBe("Maria");
    expect(result.current.form.step).toBe(2);
  });

  it("clearForm resets to initial and removes sessionStorage key", () => {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({ name: "João", email: "j@j.com", step: 3 })
    );

    const { result } = renderHook(() => useFormPersist(KEY, INITIAL));

    act(() => {
      result.current.clearForm();
    });

    expect(result.current.form).toEqual(INITIAL);
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it("handles corrupt sessionStorage gracefully and falls back to initial", () => {
    sessionStorage.setItem(KEY, "INVALID_JSON{{{");

    const { result } = renderHook(() => useFormPersist(KEY, INITIAL));

    expect(result.current.form).toEqual(INITIAL);
  });

  it("updates sessionStorage when setForm is called with a direct value", () => {
    const { result } = renderHook(() => useFormPersist(KEY, INITIAL));

    act(() => {
      result.current.setForm({ name: "Direto", email: "d@d.com", step: 2 });
    });

    const stored = JSON.parse(sessionStorage.getItem(KEY)!);
    expect(stored.name).toBe("Direto");
    expect(stored.step).toBe(2);
  });
});
