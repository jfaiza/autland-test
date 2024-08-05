"use client";
import { WagmiProvider } from "wagmi";
import { config }  from "../../../../config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children, initialState }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
