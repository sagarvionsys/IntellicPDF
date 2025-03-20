"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
// import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
// import { Toaster } from "react-hot-toast";

// Create a client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//     },
//   },
// });

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={15 * 60}>
      {/* <QueryClientProvider client={queryClient}> */}
      {/* <Toaster position="top-center" /> */}

      {children}

      {/* </QueryClientProvider> */}
    </SessionProvider>
  );
}
