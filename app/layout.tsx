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
    default: "Alhimik Studio | Immersive VR, AR, AI Experiences",
    template: "%s | Alhimik Studio",
  },
  description:
    "Creative development studio building cinematic web experiences, realtime 3D products, VR/AR interactions, and AI-driven visuals.",
  keywords: ["VR", "AR", "WebGL", "Three.js", "Realtime 3D", "AI video", "Immersive web"],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Alhimik Studio",
    description:
      "Immersive web experiences powered by realtime 3D, AR, VR, and AI visuals.",
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
