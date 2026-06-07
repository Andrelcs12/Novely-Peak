import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Novely Peak",
  description: "Controle total do seu dia. Execute tarefas, alcance metas e mantenha foco absoluto.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Novely Peak",
    description: "Sistema de execução diária com foco total.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-br"
    className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
     <body className="min-h-screen bg-background text-text flex flex-col">
  {children}
</body>
    </html>
  );
}
