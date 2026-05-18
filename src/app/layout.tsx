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
  title: "StudioAI — Crie imagens incríveis com IA",
  description: "Gere imagens com inteligência artificial usando FLUX. Transforme texto em imagens profissionais em segundos. Gratuito para começar.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://studioai-khaki.vercel.app'),
  openGraph: {
    title: "StudioAI — Crie imagens com IA",
    description: "Transforme suas ideias em imagens profissionais em segundos. Powered by FLUX. 10 gerações grátis por dia.",
    url: "https://studioai-khaki.vercel.app",
    siteName: "StudioAI",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudioAI — Crie imagens com IA",
    description: "Transforme suas ideias em imagens profissionais em segundos. 10 gerações grátis por dia.",
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
