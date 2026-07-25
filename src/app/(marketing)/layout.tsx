import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./landing.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prime — Alcanzá tu prime",
  description:
    "La app que organiza tu rutina diaria y mide tu progreso real — físico, mental, personal y laboral — en un solo lugar.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`landing ${jetbrainsMono.variable}`}>{children}</div>;
}
