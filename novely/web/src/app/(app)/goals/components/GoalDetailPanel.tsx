"use client";

import { Goal } from "@/app/types/goal";
import {
  X,
  TrendingUp,
  ShieldAlert,
  Brain,
  BarChart3,
  CheckSquare,
  Calendar,
  Flag,
  Activity,
  Target,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  goal: Goal | null;
  onClose: () => void;
  onToggleTask: (task: any) => void; // pode tipar melhor depois
};

export default function GoalExpanded({ goal, onClose, onToggleTask }: Props) {
  if (!goal) return null;

  const isCompleted = goal.status === "COMPLETED";

  const totalTasks = goal.tasks?.length ?? 0;
  const doneTasks =
    goal.tasks?.filter((t) => t.status === "DONE").length ?? 0;

  const tasksProgress =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <AnimatePresence>
      {/* overlay */}
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* modal */}
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6"
        >

          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">
                {goal.title}
              </h2>

              <p className="text-xs text-zinc-500">
                {goal.description || "Sem descrição definida"}
              </p>

              <div className="text-[10px] text-zinc-600 pt-1">
                Clique fora para fechar
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-800"
            >
              <X size={16} />
            </button>
          </div>

          {/* STATUS + METADADOS */}
          <div className="flex flex-wrap gap-2 text-xs">

            <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              Status: {goal.status}
            </span>

            <span className="flex items-center gap-1 text-zinc-400">
              <Flag size={12} />
              {goal.priority}
            </span>

            {goal.dueDate && (
              <span className="flex items-center gap-1 text-zinc-400">
                <Calendar size={12} />
                Prazo: {new Date(goal.dueDate).toLocaleDateString("pt-BR")}
              </span>
            )}

            {goal.startedAt && (
              <span className="text-zinc-500">
                Início: {new Date(goal.startedAt).toLocaleDateString("pt-BR")}
              </span>
            )}

            {goal.completedAt && (
              <span className="text-emerald-400">
                Concluída em {new Date(goal.completedAt).toLocaleDateString("pt-BR")}
              </span>
            )}

          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="text-xs text-zinc-400 flex items-center gap-1">
                <BarChart3 size={12} />
                Score
              </div>
              <div className="text-lg text-purple-400 font-semibold">
                {goal.score ?? 0}
              </div>
            </div>

            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="text-xs text-zinc-400 flex items-center gap-1">
                <Brain size={12} />
                Health
              </div>
              <div className="text-lg text-blue-400 font-semibold">
                {goal.healthScore ?? 0}
              </div>
            </div>

            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="text-xs text-zinc-400 flex items-center gap-1">
                <ShieldAlert size={12} />
                Risk
              </div>
              <div className="text-lg text-red-400 font-semibold">
                {goal.riskLevel ?? "LOW"}
              </div>
            </div>

            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="text-xs text-zinc-400 flex items-center gap-1">
                <Activity size={12} />
                Tasks
              </div>
              <div className="text-lg text-zinc-300 font-semibold">
                {doneTasks}/{totalTasks}
              </div>
            </div>

          </div>

          {/* PROGRESSO GERAL */}
          <div>
            <div className="flex justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <TrendingUp size={12} />
                Progresso da meta
              </span>
              <span>{goal.progress}%</span>
            </div>

            <div className="h-2 bg-zinc-800 rounded mt-2 overflow-hidden">
              <div
                className="h-full bg-purple-500"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>

          {/* PROGRESSO DAS TASKS */}
          {totalTasks > 0 && (
            <div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <CheckSquare size={12} />
                  Execução (tasks)
                </span>
                <span>{tasksProgress}%</span>
              </div>

              <div className="h-2 bg-zinc-800 rounded mt-2 overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${tasksProgress}%` }}
                />
              </div>
            </div>
          )}

         
         {/* TASKS */}
<div className="space-y-3">

  <div className="flex items-center gap-2 text-sm text-zinc-300">
    <Target size={14} />
    Tarefas vinculadas
  </div>

  {goal.tasks?.length ? (
    <div className="space-y-2 max-h-56 overflow-auto pr-1">

      {goal.tasks.map((t) => {
        const isDone = t.status === "DONE";

        return (
          <div
            key={t.id}
            className="
              group
              flex items-center justify-between
              gap-3
              p-2.5
              rounded-lg
              border border-zinc-800
              bg-zinc-900
              hover:bg-zinc-800/60
              transition
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-2 min-w-0">

              {/* CHECK */}
              <button
                onClick={() => onToggleTask(t)} // 🔥 IMPORTANTE
                className={`
                  w-4 h-4 rounded border flex items-center justify-center transition
                  ${isDone
                    ? "bg-purple-500 border-purple-500"
                    : "border-zinc-600 hover:border-purple-400"}
                `}
              >
                {isDone && (
                  <div className="w-2 h-2 bg-white rounded-sm" />
                )}
              </button>

              {/* TITLE */}
              <span
                className={`
                  text-xs truncate
                  ${isDone
                    ? "line-through text-zinc-500"
                    : "text-zinc-200"}
                `}
              >
                {t.title}
              </span>

            </div>

            {/* RIGHT STATUS */}
            <span
              className={`
                text-[10px] px-2 py-0.5 rounded-full
                ${t.status === "DONE" && "bg-emerald-500/10 text-emerald-400"}
                ${t.status === "IN_PROGRESS" && "bg-blue-500/10 text-blue-400"}
                ${t.status === "TODO" && "bg-zinc-700 text-zinc-400"}
              `}
            >
              {t.status}
            </span>
          </div>
        );
      })}

    </div>
  ) : (
    <div className="text-xs text-zinc-500 p-3 border border-zinc-800 rounded">
      Nenhuma tarefa vinculada a esta meta
    </div>
  )}
</div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}