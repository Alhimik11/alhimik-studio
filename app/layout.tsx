import type { Metadata } from "next";
import { Sora, Space_Mono, Unbounded } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { AppProviders } from "@/components/providers/AppProviders";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alhimik-studio.ru"),
  title: {
    default: "Alhimik Studio | Иммерсивные VR, AR и AI-проекты",
    template: "%s | Alhimik Studio",
  },
  description:
    "Креативная студия разработки: кинематографичные веб-сцены, 3D в реальном времени, VR/AR-интерактив и AI-визуализации.",
  keywords: ["VR", "AR", "WebGL", "Three.js", "3D в реальном времени", "AI-видео", "Иммерсивный веб"],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Alhimik Studio",
    description:
      "Иммерсивные веб-решения на базе 3D в реальном времени, AR, VR и AI-визуалов.",
    url: "https://alhimik-studio.ru",
    siteName: "Alhimik Studio",
    locale: "ru_RU",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${sora.variable} ${unbounded.variable} ${spaceMono.variable} font-sans antialiased`}>
        <AppProviders>
          <Header />
          <main className="min-h-screen overflow-x-clip">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
