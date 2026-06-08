"use client";

import { Goal } from "@/types/goal";
import {
  CheckCircle2, Circle, Trash2, Calendar, Flag,
  Pencil, AlertTriangle, Brain, Activity, Target, ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  goals:            Goal[];
  onEdit:           (goal: Goal) => void;
  onDelete:         (goal: Goal) => void;
  onToggleComplete: (goal: Goal) => void;
  onOpen:           (goal: Goal) => void;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PRIORITY_LABEL: Record<string, string> = { HIGH: "Alta", MEDIUM: "Média", LOW: "Baixa" };
const PRIORITY_COLOR: Record<string, string> = {
  HIGH: "text-red-400", MEDIUM: "text-yellow-400", LOW: "text-zinc-400",
};
const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ativa", PAUSED: "Pausada", COMPLETED: "Concluída", ABANDONED: "Abandonada",
};

function calcProgress(tasks: Goal["tasks"]): number {
  if (!tasks?.length) return 0;
  return Math.round((tasks.filter((t) => t.status === "DONE").length / tasks.length) * 100);
}

function calcHealth(goal: Goal): number {
  const p = calcProgress(goal.tasks);
  if (goal.status === "COMPLETED") return 100;
  if (goal.status === "ABANDONED") return 0;
  const overdue = goal.dueDate && new Date(goal.dueDate).getTime() < Date.now();
  if (overdue) return Math.max(0, p - 30);
  if (goal.status === "PAUSED") return Math.round(p * 0.7);
  return p;
}

function calcScore(goal: Goal): number {
  const p = calcProgress(goal.tasks);
  if (goal.status === "COMPLETED") return 100;
  if (goal.status === "ABANDONED") return 0;
  const overdue = goal.dueDate && new Date(goal.dueDate).getTime() < Date.now();
  return Math.min(100, Math.round(overdue ? Math.max(0, p - 20) : p));
}

const healthColor = (h: number) =>
  h >= 70 ? "text-emerald-400" : h >= 40 ? "text-yellow-400" : "text-red-400";

// ─── Componente ──────────────────────────────────────────────────────────────

export default function GoalsList({ goals, onEdit, onDelete, onToggleComplete, onOpen }: Props) {
  if (!goals.length) {
    return (
      <div className="p-10 text-center text-zinc-500 border border-zinc-800 rounded-xl bg-zinc-900">
        <Target size={32} className="mx-auto mb-3 text-zinc-700" />
        <p className="text-sm">Nenhuma meta encontrada</p>
      </div>
    );
  }

  return (
    <div className={`grid  gap-4 
    ${goals.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
      <AnimatePresence>
        {goals.map((goal) => {
          const done       = goal.status === "COMPLETED";
          const overdue    = goal.dueDate && new Date(goal.dueDate).getTime() < Date.now() && !done;
          const progress   = calcProgress(goal.tasks);
          const health     = calcHealth(goal);
          const score      = calcScore(goal);
          const totalTasks = goal.tasks?.length ?? 0;
          const doneTasks  = goal.tasks?.filter((t) => t.status === "DONE").length ?? 0;

          return (
            <motion.div
              key={goal.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              onClick={() => onOpen(goal)}
              className={`group relative p-4 rounded-xl border space-y-4 cursor-pointer
                         transition active:scale-[0.99]
                         ${done
                           ? "bg-zinc-900/50 border-zinc-800 opacity-80"
                           : "bg-zinc-900 border-zinc-800 hover:border-purple-500/40 hover:bg-zinc-900/80"
                         }`}
            >
              {/* Hint hover */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1
                              text-[10px] text-zinc-600 opacity-0 group-hover:opacity-100 transition">
                <ExternalLink size={10} /> Abrir
              </div>

              {/* ── HEADER ── */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 min-w-0">
                  {/* Toggle completo */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleComplete(goal); }}
                    className="mt-0.5 shrink-0"
                  >
                    {done
                      ? <CheckCircle2 size={20} className="text-purple-400" />
                      : <Circle size={20} className="text-zinc-600 hover:text-purple-400 transition" />
                    }
                  </button>

                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      done ? "line-through text-zinc-500" : "text-zinc-100"
                    }`}>
                      {goal.title}
                    </p>
                    {goal.description && (
                      <p className="text-xs text-zinc-500 truncate">{goal.description}</p>
                    )}
                    <span className="text-[10px] text-zinc-500 mt-0.5 block">
                      {STATUS_LABEL[goal.status]}
                    </span>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onEdit(goal)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400
                               hover:text-white transition">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => onDelete(goal)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400
                               hover:text-red-400 transition">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* ── TAGS ── */}
              <div className="flex flex-wrap gap-2 text-[11px] text-zinc-400">
                <span className={`flex items-center gap-1 ${PRIORITY_COLOR[goal.priority]}`}>
                  <Flag size={10} />
                  {PRIORITY_LABEL[goal.priority]}
                </span>

                {goal.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(goal.dueDate).toLocaleDateString("pt-BR")}
                  </span>
                )}

                {overdue && (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertTriangle size={10} /> Atrasada
                  </span>
                )}
              </div>

              {/* ── BARRA DE PROGRESSO ── */}
              <div>
                <div className="flex justify-between text-[10px] text-zinc-500 mb-1">
                  <span>Progresso</span>
                  <span className="text-zinc-300 font-medium">{progress}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                  />
                </div>
              </div>

              {/* ── KPIs ── */}
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 flex items-center gap-1 mb-1">
                    <Activity size={10} /> Score
                  </div>
                  <div className="text-purple-400 font-semibold">{score}</div>
                </div>

                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 flex items-center gap-1 mb-1">
                    <Brain size={10} /> Health
                  </div>
                  <div className={`font-semibold ${healthColor(health)}`}>{health}</div>
                </div>

                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-zinc-500 mb-1">Tasks</div>
                  <div className={`font-semibold ${
                    totalTasks > 0 && doneTasks === totalTasks ? "text-emerald-400" : "text-purple-300"
                  }`}>
                    {doneTasks}/{totalTasks}
                  </div>
                </div>
              </div>

              {/* Barra de tasks */}
              {totalTasks > 0 && (
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${(doneTasks / totalTasks) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-emerald-500/60 rounded-full"
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}