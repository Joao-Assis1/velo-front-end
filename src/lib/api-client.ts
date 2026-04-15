export async function fetchWrapper<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  // Fallback seguro forçando IPv4 caso a env falhe ou contenha localhost
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace("localhost", "127.0.0.1") ||
    "http://127.0.0.1:3001/api/v1";

  const url = `${baseUrl}${endpoint}`;

  let token = null;
  if (typeof window === "undefined") {
    // No servidor (Server Actions)
    const { cookies } = await import("next/headers");
    token = (await cookies()).get("velo-token")?.value;
  } else {
    // No cliente (Componentes React)
    const match = document.cookie.match(/(^|;)\s*velo-token\s*=\s*([^;]+)/);
    token = match ? match[2] : null;
  }

  try {
    const isFormData = options.body instanceof FormData;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      // Desabilita cache agressivo para requisições dinâmicas (Aulas, Instrutores)
      cache: options.cache || "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `Erro na requisição: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  } catch (error: any) {
    console.error(
      `[FetchError] ${options.method || "GET"} ${url}:`,
      error.message,
    );
    throw error;
  }
}
