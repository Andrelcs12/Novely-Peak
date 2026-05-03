"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import {
  Play, CheckCircle2, Circle, Square, Flame,
  Plus, Target, Trophy, AlertTriangle, Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import StreakIntro from "./StreakIntro";

type Props = {
  tasks: Task[];
  onReload: () => void;
  onCreateTask?: () => void;
  todayState?: TodayState | null;
};


type Task = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
};

type Streak = {
  current: number;
  best: number;
  status: "ACTIVE" | "BROKEN" | "FROZEN";
  message?: string;
};

type TodayState = {
  started: boolean;
  ended:   boolean;
};

// ─── Sons (lazy — só cria no browser) ─────────────────────────────────────────
let sounds: Record<string, HTMLAudioElement> | null = null;
function getSound(key: "up" | "broken" | "warning") {
  if (typeof window === "undefined") return null;
  if (!sounds) {
    sounds = {
      up:      new Audio("/sounds/streak-up.mp3"),
      broken:  new Audio("/sounds/streak-broken.mp3"),
      warning: new Audio("/sounds/streak-warning.mp3"),
    };
  }
  return sounds[key];
}

export default function DashboardToday({
  tasks,
  onReload,
  onCreateTask,
  todayState,
}: Props) {
  const [showIntro,     setShowIntro]     = useState(false);
  const [streakLoading, setStreakLoading] = useState(false);
  const [streak,        setStreak]        = useState<Streak | null>(null);
  const [endResult,     setEndResult]     = useState<Streak | null>(null); // resultado do encerramento

  useEffect(() => {
    loadStreak();
  }, []);

  const loadStreak = async () => {
    try {
      const res = await api.get("/streak/me");
      // suporta { data: ... } ou direto
      setStreak((res as any)?.data ?? res);
    } catch (e) { console.error(e); }
  };

  

  // Tarefas de hoje (pendentes, priorizadas, máx 5)
  const todayTasks = useMemo(() => {
    const order: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    return tasks
      .filter((t) => t.status !== "DONE")
      .sort((a, b) => (order[b.priority ?? "LOW"] ?? 1) - (order[a.priority ?? "LOW"] ?? 1))
      .slice(0, 5);
  }, [tasks]);

  const doneCount = tasks.filter((t) => t.status === "DONE").length;
  const total     = tasks.length;
  const progress  = total ? Math.round((doneCount / total) * 100) : 0;

  const startDay = async () => {
  try {
    await onReload();
  } catch (err) {
    console.error(err);
  }
};

const endDay = async () => {
  setStreakLoading(true);
  try {
    const data = await api.post("/streak/update", { progress });
    const result = (data as any)?.data ?? data;

    setStreak(result);
    setEndResult(result);

    if (result.status === "ACTIVE") getSound("up")?.play();
    if (result.status === "FROZEN") getSound("warning")?.play();
    if (result.status === "BROKEN") getSound("broken")?.play();

    window.dispatchEvent(new Event("streak_updated"));
    onReload();
  } catch (err) {
    console.error(err);
  } finally {
    setStreakLoading(false);
  }
};

  // ─── Marcar tarefa como concluída ─────────────────────────────────────────
  const handleComplete = async (id: string) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status: "DONE" });
      onReload();
    } catch (err) { console.error(err); }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // TELAS
  // ══════════════════════════════════════════════════════════════════════════


  {todayState?.ended && (
  <div className="p-3 mb-3 rounded-xl border border-zinc-800 bg-zinc-900 flex items-center justify-between">
    <div className="text-xs text-zinc-400">
      Dia finalizado • streak atualizado
    </div>

     {/* Stats rápidos */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="text-sm font-semibold text-white">{doneCount}</div>
              <div className="text-[10px] text-zinc-500">concluídas</div>
            </div>
            <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className="text-sm font-semibold text-white">{total - doneCount}</div>
              <div className="text-[10px] text-zinc-500">pendentes</div>
            </div>
            <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
              <div className={`text-sm font-semibold ${
                (endResult?.status === "ACTIVE" || streak?.status === "ACTIVE") ? "text-orange-400" : "text-zinc-400"
              }`}>{endResult?.current ?? streak?.current ?? 0}</div>
              <div className="text-[10px] text-zinc-500">streak</div>
            </div>
          </div>

    <div className="text-xs text-orange-400 font-medium">
      🔥 {streak?.current ?? 0} dias
    </div>
  </div>
)}

  // 3. Dia em execução
  return (
    <>
      <div className="p-5 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">Hoje</div>
            <div className="text-base font-semibold text-white">Execução diária</div>
          </div>
          <button
            onClick={() => setShowIntro(true)}
            className="flex items-center gap-1.5 text-orange-400 text-xs bg-orange-500/10
                       px-2.5 py-1.5 rounded-lg border border-orange-500/20 hover:bg-orange-500/15 transition"
          >
            <Flame size={13} />
            {streak?.current ?? 0} dias
          </button>
        </div>

        {/* Progresso */}
        <div>
          <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
            <span>Execução</span>
            <span className="font-medium text-white">{progress}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-purple-500 rounded-full"
            />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
            <span>{doneCount}/{total} tarefas</span>
            <span className={progress >= 70 ? "text-emerald-500" : progress >= 40 ? "text-yellow-500" : "text-zinc-500"}>
              {progress >= 70 ? "✓ meta atingida" : progress >= 40 ? "⚠ próximo do limite" : "abaixo da meta (70%)"}
            </span>
          </div>
        </div>

        {/* Lista de tarefas */}
        <div className="space-y-2">
          <AnimatePresence>
            {todayTasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-zinc-500 text-center py-4 border border-dashed border-zinc-800 rounded-xl"
              >
                Todas as tarefas foram concluídas 🎉
              </motion.div>
            ) : (
              todayTasks.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-800"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Circle size={15} className="text-zinc-600 shrink-0" />
                    <span className="text-sm text-zinc-200 truncate">{t.title}</span>
                    {t.priority === "HIGH" && (
                      <span className="text-[10px] text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded shrink-0">Alta</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleComplete(t.id)}
                    className="text-xs px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition shrink-0 ml-2"
                  >
                    OK
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Encerrar dia */}
        <button
          onClick={endDay}
          disabled={streakLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                     bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white
                     text-sm transition disabled:opacity-50"
        >
          {streakLoading ? (
            <span className="animate-pulse text-xs">Calculando streak...</span>
          ) : (
            <>
              <Square size={13} />
              Encerrar dia
            </>
          )}
        </button>
      </div>

      <StreakIntro open={showIntro} onClose={() => setShowIntro(false)} />
    </>
  );
}