import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePersistedState, clearPersistedState } from "@/hooks/usePersistedState";

describe("usePersistedState", () => {
  beforeEach(() => sessionStorage.clear());

  it("returns the initial value when nothing is stored", () => {
    const { result } = renderHook(() => usePersistedState("form", { name: "" }));
    expect(result.current[0]).toEqual({ name: "" });
  });

  it("restores a previously persisted value (no reset)", () => {
    sessionStorage.setItem("form", JSON.stringify({ name: "Ana" }));
    const { result } = renderHook(() => usePersistedState("form", { name: "" }));
    expect(result.current[0]).toEqual({ name: "Ana" });
  });

  it("persists updates to sessionStorage", () => {
    const { result } = renderHook(() => usePersistedState("form", { name: "" }));
    act(() => result.current[1]({ name: "João" }));
    expect(result.current[0]).toEqual({ name: "João" });
    expect(JSON.parse(sessionStorage.getItem("form")!)).toEqual({ name: "João" });
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() => usePersistedState("step", 1));
    act(() => result.current[1]((p: number) => p + 1));
    expect(result.current[0]).toBe(2);
  });

  it("clearPersistedState removes the stored key", () => {
    sessionStorage.setItem("form", JSON.stringify({ name: "Ana" }));
    clearPersistedState("form");
    expect(sessionStorage.getItem("form")).toBeNull();
  });
});
