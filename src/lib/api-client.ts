const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function fetchWrapper<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("velo-token");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `API error: ${response.status}`;
    throw new Error(message);
  }

  const responseData = await response.json();
  if (responseData && typeof responseData === 'object' && 'success' in responseData && 'data' in responseData) {
    return responseData.data;
  }
  return responseData;
}
