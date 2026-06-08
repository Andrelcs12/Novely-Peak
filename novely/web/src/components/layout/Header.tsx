"use client";

import { Menu, Bell, Flame } from "lucide-react";
import { User } from "@/types/user";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import StreakIntro from "@/app/(app)/dashboard/components/StreakIntro";
import { api } from "@/lib/api";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  user: User;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
  onOpenCommand: () => void;
};

type Streak = {
  current: number;
  best: number;
  status: "ACTIVE" | "BROKEN" | "FROZEN";
};

export default function Header({ user, actions, onOpenCommand }: Props) {
  const { toggleSidebar } = useSidebar();

  const [now, setNow] = useState(new Date());
  const [streak, setStreak] = useState<Streak>({ current: 0, best: 0, status: "ACTIVE" });
  const [showIntro, setShowIntro] = useState(false);
  const [shake, setShake] = useState(false);

  const sounds = useMemo(() => ({
    up:      new Audio("/sounds/streak-up.mp3"),
    broken:  new Audio("/sounds/streak-broken.mp3"),
    warning: new Audio("/sounds/streak-warning.mp3"),
  }), []);

  // clock
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // load streak
  const loadStreak = async () => {
    try {
      const response = await api.get("/streak/me");
      const data = response?.data ?? response;
      if (!data) return;
      setStreak({
        current: data.current ?? 0,
        best:    data.best    ?? 0,
        status:  data.status  ?? "ACTIVE",
      });
    } catch (err) {
      console.error("Erro ao carregar streak:", err);
    }
  };

  useEffect(() => { loadStreak(); }, []);

  // streak update listener
  useEffect(() => {
    const handler = async () => {
      try {
        const response = await api.get("/streak/me");
        const data = response?.data ?? response;
        if (!data) return;

        const next: Streak = {
          current: data.current ?? 0,
          best:    data.best    ?? 0,
          status:  data.status  ?? "ACTIVE",
        };

        setStreak((prev) => {
          if (next.current > prev.current) {
            sounds.up.play().catch(() => {});
            setShake(true);
            setTimeout(() => setShake(false), 600);
          }
          if (next.status === "BROKEN" && prev.status !== "BROKEN") {
            sounds.broken.play().catch(() => {});
          }
          if (next.status === "FROZEN" && prev.status !== "FROZEN") {
            sounds.warning.play().catch(() => {});
          }
          return next;
        });
      } catch (err) {
        console.error("Erro ao atualizar streak:", err);
      }
    };

    window.addEventListener("streak_updated", handler);
    return () => window.removeEventListener("streak_updated", handler);
  }, [sounds]);

  const formattedDate = now.toLocaleDateString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long",
  });

  const formattedTime = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <>
      <header className="h-14 md:h-16 border-b border-purple-500/20 bg-zinc-950 flex items-center justify-between px-4 md:px-6">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* botão mobile — agora conectado ao useSidebar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden text-zinc-400 hover:text-white hover:bg-zinc-900"
          >
            <Menu size={18} />
          </Button>

          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-xs text-zinc-500 capitalize">{formattedDate}</span>
            <span className="text-sm text-white font-medium">{formattedTime}h</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {actions}

          {/* command */}
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenCommand}
            className="rounded-full bg-zinc-900 border-purple-500/30 text-white hover:bg-zinc-800 hover:text-white"
          >
            +
          </Button>

          {/* streak — na mão, não faz sentido shadcn aqui */}
          <motion.div
            onClick={() => setShowIntro(true)}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: shake ? [1, 1.1, 0.95, 1] : 1 }}
            transition={{ duration: 0.4 }}
            className="cursor-pointer relative flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition"
          >
            <AnimatePresence>
              {shake && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-orange-400 blur-xl"
                />
              )}
            </AnimatePresence>
            <Flame size={18} className="text-orange-400 z-10" />
            <span className="text-xs text-orange-300 font-semibold z-10">{streak.current}</span>
            <span className="text-xs text-orange-300 z-10">dias</span>
          </motion.div>

          {/* notificações — Popover do shadcn */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-full bg-zinc-900 border-purple-500/30 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 bg-zinc-900 border-zinc-800 text-white p-0"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <span className="text-sm font-semibold">Notificações</span>
                <span className="text-xs text-zinc-400 cursor-pointer hover:text-white">
                  Marcar todas como lidas
                </span>
              </div>

              <div className="flex flex-col divide-y divide-zinc-800">
                {/* placeholder — substitui pelos dados reais quando tiver */}
                <div className="px-4 py-3 flex items-start gap-3 hover:bg-zinc-800/50 transition">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-zinc-200">Meta "Ler 10 livros" está 80% concluída</span>
                    <span className="text-xs text-zinc-500">há 2 horas</span>
                  </div>
                </div>
                <div className="px-4 py-3 flex items-start gap-3 hover:bg-zinc-800/50 transition">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-zinc-200">Seu streak está em risco! Complete uma tarefa hoje.</span>
                    <span className="text-xs text-zinc-500">há 5 horas</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-zinc-800">
                <span className="text-xs text-zinc-400 cursor-pointer hover:text-white">
                  Ver todas as notificações
                </span>
              </div>
            </PopoverContent>
          </Popover>

          {/* avatar — na mão */}
          <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-600 bg-zinc-800 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-purple-400 font-semibold">{user?.name?.[0]}</span>
            )}
          </div>
        </div>
      </header>

      <StreakIntro open={showIntro} onClose={() => setShowIntro(false)} />
    </>
  );
}