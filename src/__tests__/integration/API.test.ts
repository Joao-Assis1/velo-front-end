import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/profile/route";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { cookies } from "next/headers";

describe("API: /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if session token is missing", async () => {
    (cookies as any).mockResolvedValue({
      get: vi.fn().mockReturnValue(undefined),
    });

    const request = new Request("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify({ name: "Test" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Não autorizado");
  });

  it("forwards request to backend and returns data on success", async () => {
    (cookies as any).mockResolvedValue({
      get: vi.fn().mockReturnValue({ value: "fake-token" }),
    });

    const mockBackendResponse = { id: "1", name: "Test User" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBackendResponse,
    } as Response);

    const request = new Request("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify({ name: "Test User" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockBackendResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/profile"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer fake-token",
        }),
      })
    );
  });

  it("returns 500 on internal error", async () => {
    (cookies as any).mockResolvedValue({
      get: vi.fn().mockImplementation(() => {
        throw new Error("Cookie error");
      }),
    });

    const request = new Request("http://localhost/api/profile", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");
  });
});
