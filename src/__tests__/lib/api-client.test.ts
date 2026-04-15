/**
 * Tests: fetchWrapper (api-client.ts)
 *
 * Covers:
 *  1. Happy path – successful response passthrough
 *  2. Throws on non-OK HTTP status with error message from body
 *  3. Falls back to generic message when body has no message
 *  4. Attaches Authorization header when token is in document.cookie (browser env)
 *  5. Omits Authorization when no token in cookie
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── helpers ────────────────────────────────────────────────────────────────
const mockFetch = (body: unknown, status = 200) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 500 ? "Internal Server Error" : status === 401 ? "Unauthorized" : "OK",
    json: async () => body,
  } as Response);
};

// Re-import after each test so module state resets (important for env vars)
const getClient = async () =>
  (await import("@/lib/api-client")).fetchWrapper;

// ── suite ──────────────────────────────────────────────────────────────────
describe("fetchWrapper", () => {
  beforeEach(() => {
    vi.resetModules();
    // Clear document.cookie
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    });
  });

  // ── 1. Happy path ─────────────────────────────────────────────────────
  it("returns response data on a successful request", async () => {
    const payload = { id: "abc", name: "Aluno" };
    mockFetch(payload);

    const fetchWrapper = await getClient();
    const result = await fetchWrapper<typeof payload>("/students/abc");

    expect(result).toEqual(payload);
  });

  // ── 2. Returns raw data without unwrapping envelopes ──────────────────
  it("returns the raw response body (does not unwrap { success, data })", async () => {
    const outer = { success: true, data: { id: "xyz", status: "upcoming" } };
    mockFetch(outer);

    const fetchWrapper = await getClient();
    const result = await fetchWrapper<typeof outer>("/lessons/xyz");

    // fetchWrapper returns exact JSON – no envelope unwrapping
    expect(result).toEqual(outer);
  });

  // ── 3. Throws on non-OK status ────────────────────────────────────────
  it("throws an error when the response is not OK (4xx / 5xx)", async () => {
    mockFetch({ message: "Não autorizado" }, 401);

    const fetchWrapper = await getClient();

    await expect(fetchWrapper("/protected")).rejects.toThrow("Não autorizado");
  });

  // ── 3b. Falls back to generic message when error body lacks message ───
  it("throws a generic error message when API body has no message field", async () => {
    mockFetch({}, 500);

    const fetchWrapper = await getClient();

    await expect(fetchWrapper("/broken")).rejects.toThrow(/Erro na requisição: 500/);
  });

  // ── 4. Attaches Authorization header when token present ───────────────
  it("adds the Bearer token header when a token exists in document.cookie", async () => {
    // In jsdom, typeof window !== "undefined", so api-client reads from document.cookie
    document.cookie = "velo-token=my-jwt-token; path=/";
    mockFetch({ ok: true });

    const fetchWrapper = await getClient();
    await fetchWrapper("/lessons");

    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.headers).toMatchObject({
      Authorization: "Bearer my-jwt-token",
    });
  });

  // ── 5. Omits Authorization when no token ─────────────────────────────
  it("does NOT add Authorization header when there is no token in cookie", async () => {
    mockFetch({ items: [] });

    const fetchWrapper = await getClient();
    await fetchWrapper("/instructors");

    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.headers).not.toHaveProperty("Authorization");
  });
});
