"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { User } from "@/app/types/user";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then(setUser)
      .catch(() => {
        window.location.href = "/auth";
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔥 LOADING STATE (evita undefined)
  if (loading || !user) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-sm">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-white">

      <Sidebar
        user={user}
        isOpen={open}
        onClose={() => setOpen(false)}
      />

      <div className="flex flex-col flex-1">

        <Header
          user={user}
          onMenuClick={() => setOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}