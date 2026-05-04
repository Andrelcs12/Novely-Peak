"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import BottomBar from "../components/layout/BottomBar";
import CommandMenu from "../components/layout/CommandMenu";

import { User } from "@/app/types/user";
import Loading from "../components/ui/loading";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [openSidebar, setOpenSidebar] = useState(false);
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
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar
        user={user}
        isOpen={openSidebar}
        onClose={() => setOpenSidebar(false)}
      />

      {/* CONTENT */}
      <div className="flex flex-col flex-1 min-w-0">

        <Header
          user={user}
          onMenuClick={() => setOpenSidebar(true)}
          onOpenCommand={() => setOpenCommand(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </main>

      </div>

      {/* MOBILE NAV */}
      <BottomBar onOpenCommand={() => setOpenCommand(true)} />

      {/* GLOBAL COMMAND MENU */}
      <CommandMenu
        open={openCommand}
        onClose={() => setOpenCommand(false)}
      />
    </div>
  );
}