import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "@/context/AppContext";

/**
 * Test wrapper that provides the QueryClientProvider required by AppContext
 * (which calls useQueryClient) plus the AppProvider itself. A fresh QueryClient
 * is created per wrapper instance with retries disabled for deterministic tests.
 */
export function createAppWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(
      () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
    );
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      React.createElement(AppProvider, null, children),
    );
  };
}
