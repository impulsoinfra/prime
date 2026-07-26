import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://prime-steel-sigma.vercel.app"),
  title: "Prime",
  description: "Organizá tu día y medí tu progreso hacia tu prime.",
  openGraph: {
    title: "Prime — Alcanzá tu prime",
    description:
      "Organizá tu rutina diaria y medí tu progreso real — físico, mental, personal y laboral — en un solo lugar.",
    url: "/",
    siteName: "Prime",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime — Alcanzá tu prime",
    description:
      "Organizá tu rutina diaria y medí tu progreso real, en un solo lugar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
