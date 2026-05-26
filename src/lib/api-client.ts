async function resolveAuthHeader(): Promise<Record<string, string>> {
  let token: string | null = null;
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    token = (await cookies()).get("velo-token")?.value ?? null;
  } else {
    const match = document.cookie.match(/(^|;)\s*velo-token\s*=\s*([^;]+)/);
    token = match ? match[2] : null;
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function resolveBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace("localhost", "127.0.0.1") ||
    "http://127.0.0.1:3001/api/v1"
  );
}

function resolveTestModeHeader(): Record<string, string> {
  return process.env.NEXT_PUBLIC_TEST_MODE === "true"
    ? { "X-Test-Mode": "true" }
    : {};
}

const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

function isPublicEndpoint(endpoint: string): boolean {
  return PUBLIC_ENDPOINTS.some((pub) => endpoint.startsWith(pub));
}

export async function fetchWrapper<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${resolveBaseUrl()}${endpoint}`;
  const isFormData = options.body instanceof FormData;
  const auth = isPublicEndpoint(endpoint) ? {} : await resolveAuthHeader();
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...auth,
      ...resolveTestModeHeader(),
      ...options.headers,
    },
    cache: options.cache || "no-store",
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message =
      typeof errorData?.message === "string"
        ? errorData.message
        : Array.isArray(errorData?.message)
          ? errorData.message[0]
          : null;
    throw new Error(
      message || `Erro na requisição: ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}

export async function fetchBlob(
  endpoint: string,
  options: RequestInit = {},
): Promise<Blob> {
  const url = `${resolveBaseUrl()}${endpoint}`;
  const auth = await resolveAuthHeader();
  const response = await fetch(url, {
    ...options,
    headers: { ...auth, ...resolveTestModeHeader(), ...options.headers },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Falha ao baixar: ${response.status}`);
  return response.blob();
}
