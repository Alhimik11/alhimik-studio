import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: "Alhimik Studio | VR/AR/MR, 3D Визуализация, BIM",
  description: "Создаем будущее с помощью виртуальной реальности, 3D-визуализации и BIM-технологий. VR/AR/MR приложения, архитектурная визуализация, 3D-анимация.",
  keywords: ["VR", "AR", "MR", "3D визуализация", "архитектурная визуализация", "BIM", "3D анимация", "виртуальная реальность"],
  authors: [{ name: "Alhimik Studio" }],
  openGraph: {
    title: "Alhimik Studio | Визуализируем будущее",
    description: "VR/AR/MR разработка, 3D-визуализация, архитектурная визуализация, BIM-проектирование",
    type: "website",
    locale: "ru_RU",
    siteName: "Alhimik Studio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-black text-white`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
