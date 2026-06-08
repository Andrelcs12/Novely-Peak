"use client";

import { useEffect, useState } from "react";
import {
  X, TrendingUp, ShieldAlert, Brain, BarChart3,
  Activity, Target, Calendar, Save, Flag,
  CheckCircle2, Circle, Clock, Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Goal, GoalTask, TaskStatus } from "@/types/goal";

// ─── Helpers de métricas ──────────────────────────────────────────────────────

function calcProgress(tasks: GoalTask[] | undefined): number {
  if (!tasks?.length) return 0;
  const done = tasks.filter((t) => t.status === "DONE").length;
  return Math.round((done / tasks.length) * 100);
}

function calcScore(goal: Goal, tasks: GoalTask[]): number {
  const p = calcProgress(tasks);
  const hasDueDate = !!goal.dueDate;
  const overdue = hasDueDate && new Date(goal.dueDate!).getTime() < Date.now();
  if (goal.status === "COMPLETED") return 100;
  let base = p;
  if (overdue) base = Math.max(0, base - 20);
  if (goal.status === "ABANDONED") return 0;
  return Math.min(100, Math.round(base));
}

function calcHealth(goal: Goal, tasks: GoalTask[]): number {
  const p = calcProgress(tasks);
  const overdue = goal.dueDate && new Date(goal.dueDate).getTime() < Date.now();
  if (goal.status === "COMPLETED") return 100;
  if (goal.status === "ABANDONED") return 0;
  if (overdue) return Math.max(0, p - 30);
  if (goal.status === "PAUSED") return Math.round(p * 0.7);
  return p;
}

function calcRisk(health: number): "LOW" | "MEDIUM" | "HIGH" {
  if (health >= 70) return "LOW";
  if (health >= 40) return "MEDIUM";
  return "HIGH";
}

const RISK_COLOR = { LOW: "text-emerald-400", MEDIUM: "text-yellow-400", HIGH: "text-red-400" };
const HEALTH_COLOR = (h: number) =>
  h >= 70 ? "text-emerald-400" : h >= 40 ? "text-yellow-400" : "text-red-400";

const STATUS_OPTIONS = ["ACTIVE", "PAUSED", "COMPLETED", "ABANDONED"] as const;
const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"] as const;
const TASK_STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "TODO",
};

// ─── Componente ──────────────────────────────────────────────────────────────

type Props = {
  goal:          Goal | null;
  onClose:       () => void;
  onToggleTask:  (task: any) => void;
  onUpdated?:    () => void;
};

export default function GoalExpanded({ goal, onClose, onToggleTask, onUpdated }: Props) {
  const [local,   setLocal]   = useState<Goal | null>(null);
  const [saving,  setSaving]  = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => { setLocal(goal); }, [goal]);

  if (!local) return null;

  const tasks   = local.tasks ?? [];
  const progress = calcProgress(tasks);
  const score    = calcScore(local, tasks);
  const health   = calcHealth(local, tasks);
  const risk     = calcRisk(health);
  const doneTasks = tasks.filter((t) => t.status === "DONE").length;

  // ─── Toggle de tarefa ────────────────────────────────────────────────────
  const handleToggle = async (task: GoalTask, idx: number) => {
    const nextStatus = TASK_STATUS_CYCLE[task.status];
    setToggling(task.id);

    // Optimistic update
    setLocal((prev) => {
      if (!prev) return prev;
      const newTasks = prev.tasks!.map((t, i) =>
        i === idx ? { ...t, status: nextStatus } : t
      );
      return { ...prev, tasks: newTasks };
    });

    try {
      await onToggleTask({ ...task, goalId: local.id, status: task.status });
    } catch {
      // Reverte se falhar
      setLocal((prev) => {
        if (!prev) return prev;
        const reverted = prev.tasks!.map((t, i) =>
          i === idx ? { ...t, status: task.status } : t
        );
        return { ...prev, tasks: reverted };
      });
    } finally {
      setToggling(null);
    }
  };

  // ─── Salvar ──────────────────────────────────────────────────────────────
  const saveAll = async () => {
    if (!local) return;
    setSaving(true);
    try {
      await api.patch(`/goals/${local.id}`, {
        title:       local.title,
        description: local.description,
        status:      local.status,
        priority:    local.priority,
        tasks:       local.tasks,
      });
      onUpdated?.();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {goal && (
        <div className="fixed inset-0 z-50 flex justify-end">

          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Painel lateral */}
          <motion.div
            className="relative w-full sm:w-[580px] h-full bg-zinc-950
                       border-l border-zinc-800 flex flex-col overflow-hidden
                       shadow-[0_0_60px_rgba(139,92,246,0.08)]"
            initial={{ x: 580, opacity: 0 }}
            animate={{ x: 0,   opacity: 1 }}
            exit={{    x: 580, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >

            {/* ── HEADER ── */}
            <div className="flex items-start justify-between p-6 border-b border-zinc-800/60 shrink-0">
              <div className="space-y-1.5 flex-1 pr-4">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Detalhes da meta</p>
                <input
                  value={local.title}
                  onChange={(e) => setLocal({ ...local, title: e.target.value })}
                  className="text-xl font-semibold text-white bg-transparent outline-none w-full
                             border-b border-transparent focus:border-purple-500/40 transition pb-0.5"
                />
                <textarea
                  value={local.description ?? ""}
                  onChange={(e) => setLocal({ ...local, description: e.target.value })}
                  rows={2}
                  className="text-xs text-zinc-400 bg-transparent outline-none w-full resize-none leading-relaxed"
                  placeholder="Adicione uma descrição..."
                />
              </div>
              <button onClick={onClose}
                className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition">
                <X size={17} />
              </button>
            </div>

            {/* ── BODY ── */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Controles de status e prioridade */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={local.status}
                  onChange={(e) => setLocal({ ...local, status: e.target.value as any })}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300
                             focus:border-purple-500/50 outline-none cursor-pointer"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <select
                  value={local.priority}
                  onChange={(e) => setLocal({ ...local, priority: e.target.value as any })}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-300
                             focus:border-purple-500/50 outline-none cursor-pointer"
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                {local.dueDate && (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-400
                                   bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5">
                    <Calendar size={12} />
                    {new Date(local.dueDate).toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <BarChart3 size={14} className="text-purple-400" />, label: "Score",    value: score,    color: "text-purple-400" },
                  { icon: <Brain     size={14} className="text-blue-400"   />, label: "Health",   value: health,   color: HEALTH_COLOR(health) },
                  { icon: <ShieldAlert size={14} className={RISK_COLOR[risk]} />, label: "Risk",  value: risk,     color: RISK_COLOR[risk] },
                  { icon: <Activity  size={14} className="text-emerald-400"/>, label: "Tasks",    value: `${doneTasks}/${tasks.length}`, color: "text-zinc-200" },
                ].map((kpi) => (
                  <div key={kpi.label}
                    className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800/60 space-y-2
                               hover:border-purple-500/20 transition">
                    <div className="flex items-center gap-1.5">
                      {kpi.icon}
                      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{kpi.label}</span>
                    </div>
                    <p className={`text-lg font-semibold ${kpi.color}`}>{kpi.value}</p>
                  </div>
                ))}
              </div>

              {/* Barra de progresso */}
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-2">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp size={12} className="text-purple-400" />
                    Progresso calculado
                  </span>
                  <span className="font-medium text-white">{progress}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                  />
                </div>
              </div>

              {/* ── TAREFAS ── */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <Target size={14} className="text-purple-400" />
                  <span>Tarefas</span>
                  <span className="ml-auto text-[10px] text-zinc-500">
                    Toque para alternar o status
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {tasks.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl p-4 text-center"
                    >
                      Nenhuma tarefa vinculada
                    </motion.div>
                  ) : (
                    tasks.map((t, idx) => {
                      const done = t.status === "DONE";
                      const inProgress = t.status === "IN_PROGRESS";
                      const isToggling = toggling === t.id;

                      return (
                        <motion.div
                          key={t.id}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => !isToggling && handleToggle(t, idx)}
                          className={`group flex items-start gap-3 p-3.5 rounded-xl border
                                     transition cursor-pointer select-none
                                     ${done
                                       ? "bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40"
                                       : inProgress
                                         ? "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40"
                                         : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                                     }`}
                        >
                          {/* Ícone de status */}
                          <div className="shrink-0 mt-0.5">
                            {isToggling ? (
                              <Loader2 size={17} className="text-purple-400 animate-spin" />
                            ) : done ? (
                              <CheckCircle2 size={17} className="text-purple-400" />
                            ) : inProgress ? (
                              <Clock size={17} className="text-blue-400" />
                            ) : (
                              <Circle size={17} className="text-zinc-600 group-hover:text-zinc-400 transition" />
                            )}
                          </div>

                          {/* Conteúdo */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className={`text-sm leading-snug ${
                              done ? "line-through text-zinc-500" : "text-zinc-200"
                            }`}>
                              {t.title}
                            </p>

                            {t.description && (
                              <p className="text-[11px] text-zinc-600 truncate">
                                {t.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                done       ? "bg-purple-500/10 text-purple-400" :
                                inProgress ? "bg-blue-500/10 text-blue-400" :
                                             "bg-zinc-800 text-zinc-500"
                              }`}>
                                {t.status === "TODO" ? "A fazer"
                                  : t.status === "IN_PROGRESS" ? "Em andamento"
                                  : "Concluída"}
                              </span>

                              {t.priority && (
                                <span className={`text-[10px] flex items-center gap-1 ${
                                  t.priority === "HIGH"   ? "text-red-400" :
                                  t.priority === "MEDIUM" ? "text-yellow-400" : "text-zinc-500"
                                }`}>
                                  <Flag size={9} />
                                  {t.priority === "HIGH" ? "Alta" : t.priority === "MEDIUM" ? "Média" : "Baixa"}
                                </span>
                              )}

                              {t.dueDate && (
                                <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                                  <Calendar size={9} />
                                  {new Date(t.dueDate).toLocaleDateString("pt-BR")}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="p-5 border-t border-zinc-800/60 flex justify-end gap-2 shrink-0">
              <button onClick={onClose}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition">
                Cancelar
              </button>
              <button onClick={saveAll} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-500
                           rounded-lg text-white text-sm font-medium transition disabled:opacity-40">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}