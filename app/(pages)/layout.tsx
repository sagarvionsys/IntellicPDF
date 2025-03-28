import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Providers from "@/lib/providers";
import Script from "next/script";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const PORT = "http://localhost:3000";

export const metadata: Metadata = {
  title: "IntellicPDF - Smart AI for Document Conversations",
  description:
    "Chat with your documents using advanced AI. Extract insights, summarize, and interact with your PDFs intelligently.",
  keywords:
    "AI PDF chat, document AI, smart PDF assistant, AI-powered document analysis",
  openGraph: {
    title: "IntellicPDF - Smart AI for Document Conversations",
    description:
      "Engage with your PDFs like never before using AI-powered document conversations.",
    type: "website",
    images: [
      {
        url: "https://intellicpdf.com/og-image.jpg",
        alt: "IntellicPDF Preview",
      },
    ],
  },
  alternates: {
    canonical: `${PORT}`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
