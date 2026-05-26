import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProvider } from "@/context/AppContext";
import Providers from "@/components/Providers";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans", weight: ["300","400","500","600","700","800","900"] });

export const metadata: Metadata = {
  title: "Velo - Direção segura, futuro certo.",
  description: "Sistema de gerenciamento de autoescola",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Velo",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/icons/icon-192x192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("font-sans", outfit.variable)} suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <AppProvider>
            {children}
          </AppProvider>
        </Providers>
      </body>
    </html>
  );
}
