import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/sidebar";
import { LifeOSProvider } from "@/context/lifeos-context";

export const metadata: Metadata = {
  title: "LifeOS — Command Center",
  description: "Seu portal de produtividade pessoal completo e integrado para controle diário de hábitos, atividades, finanças e metas.",
  keywords: ["produtividade", "lifeos", "habitos", "tarefas", "finanças", "metas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Geist:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background antialiased flex min-h-screen">
        <LifeOSProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col md:pl-[280px]">
            {children}
          </div>
        </LifeOSProvider>
      </body>
    </html>
  );
}
