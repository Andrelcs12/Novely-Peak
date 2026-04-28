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
    className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
     <body className="min-h-screen bg-background text-text flex flex-col">
  {children}
</body>
    </html>
  );
}
