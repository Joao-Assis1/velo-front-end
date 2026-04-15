import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

// Mock next/cache (server-only module)
vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
}));

// Mock next/headers (cookies is async in Next.js 15)
const cookieStore: Record<string, string> = {};
vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    get: (name: string) => {
      const value = cookieStore[name];
      return value ? { name, value } : undefined;
    },
    set: (name: string, value: string, _options?: any) => {
      cookieStore[name] = value;
    },
    delete: (name: string) => {
      delete cookieStore[name];
    },
  }),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

beforeEach(() => {
  localStorageMock.clear();
  // Clear cookie store
  Object.keys(cookieStore).forEach((key) => delete cookieStore[key]);
  vi.clearAllMocks();
});
