"use client";

import {
  Menu,
  Bell,
  Flame,
} from "lucide-react";

import { User } from "@/app/types/user";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import StreakIntro from "@/app/(app)/dashboard/components/StreakIntro";
import { api } from "@/lib/api";

type Props = {
  user: User;
  onMenuClick: () => void;
  actions?: React.ReactNode;
  onOpenCommand: () => void;
};

type Streak = {
  current: number;
  best: number;
  status: "ACTIVE" | "BROKEN" | "FROZEN";
};

export default function Header({
  user,
  onMenuClick,
  actions,
  onOpenCommand,
}: Props) {
  const [now, setNow] = useState(new Date());

  const [streak, setStreak] = useState<Streak>({
    current: 0,
    best: 0,
    status: "ACTIVE",
  });

  const [showIntro, setShowIntro] = useState(false);
  const [shake, setShake] = useState(false);

  const sounds = {
    up: new Audio("/sounds/streak-up.mp3"),
    broken: new Audio("/sounds/streak-broken.mp3"),
    warning: new Audio("/sounds/streak-warning.mp3"),
  };

  // CLOCK
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // LOAD STREAK
  const loadStreak = async () => {
    try {
      const res = await api.get("/streak/me");

      setStreak({
        current: res?.current ?? 0,
        best: res?.best ?? 0,
        status: res?.status ?? "ACTIVE",
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStreak();
  }, []);

  // REALTIME LISTENER
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await api.get("/streak/me");

        setStreak((prev) => {
          if (res.current > prev.current) {
            sounds.up.play();
            setShake(true);
            setTimeout(() => setShake(false), 500);
          }

          if (res.status === "BROKEN") sounds.broken.play();
          if (res.status === "FROZEN") sounds.warning.play();

          return {
            current: res.current ?? 0,
            best: res.best ?? 0,
            status: res.status ?? "ACTIVE",
          };
        });
      } catch (err) {
        console.error(err);
      }
    };

    window.addEventListener("streak_updated", handler);
    return () => window.removeEventListener("streak_updated", handler);
  }, []);

  const formattedDate = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const formattedTime = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <header className="h-14 md:h-16 border-b border-purple-500/20 bg-zinc-950 flex items-center justify-between px-4 md:px-6">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-900"
          >
            <Menu size={18} />
          </button>

          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-xs text-zinc-500 capitalize">
              {formattedDate}
            </span>
            <span className="text-sm text-white font-medium">
              {formattedTime}h
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {actions}

          {/* ➕ COMMAND BUTTON */}
          <button
            onClick={onOpenCommand}
            className="w-9 h-9 flex items-center justify-center rounded-full 
                       bg-zinc-900 border border-purple-500/30 text-white
                       hover:bg-zinc-800 transition"
          >
            +
          </button>

          {/* STREAK */}
          <motion.div
            onClick={() => setShowIntro(true)}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: shake ? [1, 1.1, 0.95, 1] : 1 }}
            transition={{ duration: 0.4 }}
            className="cursor-pointer relative flex items-center gap-2 px-3 py-2 rounded-lg 
                       bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition"
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

            <span className="text-xs text-orange-300 font-semibold z-10">
              {streak.current}
            </span>

            <span className="text-xs text-orange-300 z-10">
              dias
            </span>
          </motion.div>

          {/* NOTIFICATIONS */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-purple-500/30">
            <Bell size={16} className="text-zinc-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
          </button>

          {/* AVATAR */}
          <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-600 bg-zinc-800 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-purple-400 font-semibold">
                {user?.name?.[0]}
              </span>
            )}
          </div>

        </div>
      </header>

      {/* STREAK MODAL */}
      <StreakIntro open={showIntro} onClose={() => setShowIntro(false)} />
    </>
  );
}