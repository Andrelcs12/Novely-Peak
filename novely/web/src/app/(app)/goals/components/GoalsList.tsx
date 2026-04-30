"use client";

import { Goal } from "@/app/types/goal";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  Flag,
  Pencil,
  Pause,
  AlertTriangle,
  Target,
} from "lucide-react";

type Props = {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onProgressChange: (goal: Goal, progress: number) => void;
  onToggleComplete: (goal: Goal) => void;
};

function priorityStyle(priority: Goal["priority"]) {
  switch (priority) {
    case "HIGH":
      return "text-red-400 border-red-500/30 bg-red-500/10";
    case "MEDIUM":
      return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
    case "LOW":
      return "text-blue-400 border-blue-500/30 bg-blue-500/10";
  }
}

function statusBadge(status: Goal["status"]) {
  switch (status) {
    case "COMPLETED":
      return "text-purple-400 border-purple-500/30 bg-purple-500/10";
    case "PAUSED":
      return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
    case "ABANDONED":
      return "text-red-400 border-red-500/30 bg-red-500/10";
    default:
      return "text-green-400 border-green-500/30 bg-green-500/10";
  }
}

function statusLabel(status: Goal["status"]) {
  const map = {
    ACTIVE: "Ativa",
    PAUSED: "Pausada",
    COMPLETED: "Concluída",
    ABANDONED: "Abandonada",
  };
  return map[status];
}

function formatDate(date?: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("pt-BR");
}

function isOverdue(goal: Goal) {
  if (!goal.dueDate) return false;
  if (goal.status === "COMPLETED") return false;
  return new Date(goal.dueDate) < new Date();
}

export default function GoalsList({
  goals,
  onEdit,
  onDelete,
  onProgressChange,
  onToggleComplete,
}: Props) {
  if (!goals.length) {
    return (
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-sm text-center">
        Nenhuma meta encontrada.
      </div>
    );
  }

  return (
    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
      {goals.map((goal) => {
        const overdue = isOverdue(goal);
        const isDone = goal.status === "COMPLETED";

        return (
          <div
            key={goal.id}
            className="group flex flex-col gap-3 px-4 py-4 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/70 transition"
          >
            {/* TOP ROW */}
            <div className="flex items-start justify-between gap-3">

              {/* LEFT */}
              <div className="flex items-start gap-3 flex-1 min-w-0">

                {/* TOGGLE COMPLETE */}
                <button
                  onClick={() => onToggleComplete(goal)}
                  className="mt-0.5 shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 size={18} className="text-purple-400" />
                  ) : (
                    <Circle size={18} className="text-zinc-500" />
                  )}
                </button>

                {/* ICON + TITLE */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {goal.icon && (
                      <span className="text-base leading-none">{goal.icon}</span>
                    )}
                    <span
                      className={`text-sm truncate ${
                        isDone
                          ? "line-through text-zinc-500"
                          : "text-zinc-200"
                      }`}
                    >
                      {goal.title}
                    </span>
                  </div>

                  {goal.description && (
                    <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                      {goal.description}
                    </p>
                  )}

                  {/* BADGES */}
                  <div className="flex flex-wrap gap-2 mt-2">

                    <span
                      className={`text-[10px] px-2 py-[2px] rounded-full border ${statusBadge(
                        goal.status
                      )}`}
                    >
                      {statusLabel(goal.status)}
                    </span>

                    <span
                      className={`text-[10px] px-2 py-[2px] rounded-full border flex items-center gap-1 ${priorityStyle(
                        goal.priority
                      )}`}
                    >
                      <Flag size={10} />
                      {goal.priority}
                    </span>

                    {goal.dueDate && (
                      <span className="text-[10px] px-2 py-[2px] rounded-full border border-zinc-700 text-zinc-400 flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDate(goal.dueDate)}
                      </span>
                    )}

                    {goal.category && (
                      <span className="text-[10px] px-2 py-[2px] rounded-full border border-zinc-700 text-zinc-400">
                        {goal.category}
                      </span>
                    )}

                    {overdue && (
                      <span className="text-[10px] px-2 py-[2px] rounded-full border border-red-500/40 text-red-400 flex items-center gap-1">
                        <AlertTriangle size={10} />
                        atrasada
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
                <button onClick={() => onEdit(goal)}>
                  <Pencil size={16} className="text-zinc-400 hover:text-white" />
                </button>
                <button onClick={() => onDelete(goal)}>
                  <Trash2 size={16} className="text-zinc-400 hover:text-red-400" />
                </button>
              </div>

            </div>

            {/* PROGRESS BAR */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Progresso</span>
                <span
                  className={
                    goal.progress === 100 ? "text-purple-400" : "text-zinc-400"
                  }
                >
                  {goal.progress}%
                </span>
              </div>

              <div className="relative h-2 bg-zinc-700/50 rounded-full overflow-hidden">
                {/* COLOR ACCENT */}
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${goal.progress}%`,
                    backgroundColor: goal.color ?? "#8b5cf6",
                  }}
                />
              </div>

              {/* SLIDER (inline edit) — só quando não concluída */}
              {!isDone && (
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={goal.progress}
                  onChange={(e) =>
                    onProgressChange(goal, Number(e.target.value))
                  }
                  className="w-full h-1 accent-purple-500 cursor-pointer opacity-0 group-hover:opacity-100 transition mt-1"
                />
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
}