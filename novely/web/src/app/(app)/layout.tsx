"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { User } from "@/app/types/user";
import Loading from "../components/ui/loading";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import BottomBar from "../components/layout/BottomBar";
import CommandMenu from "../components/layout/CommandMenu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [openCommand, setOpenCommand] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await api.get("/auth/me");
        setUser(data);
      } catch {
        window.location.href = "/auth";
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  if (loading || !user) {
    return <Loading fullScreen text="Carregando Informações..." />;
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <SidebarInset className="bg-zinc-950 text-white">

        <Header
          user={user}
          onMenuClick={() => {}}        // mobile não precisa mais — o shadcn cuida
          onOpenCommand={() => setOpenCommand(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>

      </SidebarInset>

      <BottomBar onOpenCommand={() => setOpenCommand(true)} />
      <CommandMenu open={openCommand} onClose={() => setOpenCommand(false)} />
    </SidebarProvider>
  );
}