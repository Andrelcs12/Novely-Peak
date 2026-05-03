"use client";

import {
  Menu,
  Bell,
  User2,
  Flame,
  HelpCircle,
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
};

type Streak = {
  current: number;
  best: number;
  status: "ACTIVE" | "BROKEN" | "FROZEN";
};

export default function Header({ user, onMenuClick, actions }: Props) {
  const [now, setNow] = useState(new Date());
  const [streak, setStreak] = useState<Streak | null>(null);
  const [prevStreak, setPrevStreak] = useState<number>(0);
  const [showIntro, setShowIntro] = useState(false);
  const [shake, setShake] = useState(false);
  const [float, setFloat] = useState(false);

  // 🔊 SONS
  const sounds = {
    up: new Audio("/sounds/streak-up.mp3"),
    broken: new Audio("/sounds/streak-broken.mp3"),
    warning: new Audio("/sounds/streak-warning.mp3"),
  };

  // clock
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const loadStreak = async () => {
  try {
    const res = await api.get("/streak/me");
    setStreak(res); // ❌ não use .data
  } catch (e) {
    console.error(e);
  }
};

  useEffect(() => {
    loadStreak();
  }, []);

  // 🔥 LISTENER REAL UPDATE
  useEffect(() => {
    const handler = async () => {
      const res = await api.get("/streak/me");
      const newStreak = res.data;

      setStreak((prev) => {
        if (prev && newStreak.current > prev.current) {
          triggerEffects("UP");
        }

        if (prev && newStreak.status === "BROKEN") {
          triggerEffects("BROKEN");
        }

        if (prev && newStreak.status === "FROZEN") {
          triggerEffects("WARNING");
        }

        return newStreak;
      });
    };

    window.addEventListener("streak_updated", handler);

    return () => {
      window.removeEventListener("streak_updated", handler);
    };
  }, []);

  // 🎯 EFFECT ENGINE
  const triggerEffects = (type: "UP" | "BROKEN" | "WARNING") => {
    if (type === "UP") {
      sounds.up.play();

      setFloat(true);
      setShake(true);

      setTimeout(() => setFloat(false), 1200);
      setTimeout(() => setShake(false), 600);
    }

    if (type === "BROKEN") {
      sounds.broken.play();
      setShake(true);
      setTimeout(() => setShake(false), 800);
    }

    if (type === "WARNING") {
      sounds.warning.play();
    }
  };

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

          {/* 🔥 STREAK */}
          <motion.div
            animate={{
              scale: shake ? [1, 1.1, 0.95, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 overflow-hidden"
          >

            {/* glow pulse */}
            <AnimatePresence>
              {float && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6, y: 0 }}
                  animate={{ opacity: 0.4, scale: 1.6, y: -20 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 bg-orange-400 blur-xl"
                />
              )}
            </AnimatePresence>

            {/* flame float effect */}
            <AnimatePresence>
              {float && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: -20, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute left-2 top-0"
                >
                  🔥
                </motion.div>
              )}
            </AnimatePresence>

            <Flame size={18} className="text-orange-400 z-10" />

            {/* streak number */}
            <div className="relative h-4 overflow-hidden z-10">
              <AnimatePresence mode="wait">
                <motion.span
                  key={streak?.current}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-orange-300 font-semibold block"
                >
                  {streak?.current ?? 0}
                </motion.span>
              </AnimatePresence>
            </div>

            <span className="text-xs text-orange-300 z-10">
              dias
            </span>
          </motion.div>

          {/* HELP */}
          <button
            onClick={() => setShowIntro(true)}
            className="p-1 rounded-md hover:bg-zinc-800"
          >
            <HelpCircle size={14} className="text-zinc-500 hover:text-white" />
          </button>

          {/* NOTIFICATIONS */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-purple-500/30">
            <Bell size={16} className="text-zinc-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
          </button>

          {/* AVATAR */}
          <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-600 bg-zinc-800 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover" />
            ) : user?.name ? (
              <span className="text-xs text-purple-400 font-semibold">
                {user.name[0]}
              </span>
            ) : (
              <User2 size={16} className="text-zinc-500" />
            )}
          </div>

        </div>
      </header>

      {/* INTRO */}
      <StreakIntro open={showIntro} onClose={() => setShowIntro(false)} />
    </>
  );
}