import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OráculoAI — Conteúdo estratégico para terapeutas holísticos",
  description: "Crie posts, carrosséis, stories e copies alinhados com o calendário astral. IA especializada no nicho holístico. Grátis para começar.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://studioai-khaki.vercel.app'),
  openGraph: {
    title: "OráculoAI — Conteúdo holístico com IA",
    description: "A IA que entende astrologia, tarot e terapias holísticas. Gere conteúdo estratégico para suas redes em minutos.",
    url: "https://studioai-khaki.vercel.app",
    siteName: "OráculoAI",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OráculoAI — Conteúdo holístico com IA",
    description: "A IA que entende astrologia, tarot e terapias holísticas. Gere conteúdo estratégico para suas redes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-zinc-950 text-white">{children}</body>
    </html>
  );
}
