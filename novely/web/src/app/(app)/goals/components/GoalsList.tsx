"use client";

import { Goal } from "@/app/types/goal";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Calendar,
  Flag,
  Pencil,
  AlertTriangle,
  Brain,
  Activity,
  Target,
  ExternalLink,
} from "lucide-react";

type Props = {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onToggleComplete: (goal: Goal) => void;
  onOpen: (goal: Goal) => void;
};

const PRIORITY_LABEL: Record<string, string> = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
};

const PRIORITY_COLOR: Record<string, string> = {
  HIGH: "text-red-400",
  MEDIUM: "text-yellow-400",
  LOW: "text-zinc-400",
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: "Ativa",
  PAUSED: "Pausada",
  COMPLETED: "Concluída",
  ABANDONED: "Abandonada",
};

export default function GoalsList({
  goals,
  onEdit,
  onDelete,
  onToggleComplete,
  onOpen,
}: Props) {
  if (!goals.length) {
    return (
      <div className="p-10 text-center text-zinc-500 border border-zinc-800 rounded-xl bg-zinc-900">
        <Target size={32} className="mx-auto mb-3 text-zinc-700" />
        <p className="text-sm">Nenhuma meta encontrada</p>
      </div>
    );
  }

  const isSingle = goals.length === 1;

  return (
    <div
      className={`
        grid gap-4
        ${isSingle ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}
      `}
    >
      {goals.map((goal) => {
        const done = goal.status === "COMPLETED";

        const overdue =
          goal.dueDate &&
          new Date(goal.dueDate).getTime() < Date.now() &&
          !done;

        const health = goal.healthScore ?? 0;

        const totalTasks = goal.tasks?.length ?? 0;
        const doneTasks =
          goal.tasks?.filter((t) => t.status === "DONE").length ?? 0;

        return (
          <div
            key={goal.id}
            onClick={() => onOpen(goal)} // 🔥 OPEN EXPANDED AQUI
            className="
              group
              p-4
              bg-zinc-900
              border border-zinc-800
              rounded-xl
              space-y-4
              cursor-pointer
              hover:border-purple-500/40
              hover:bg-zinc-900/80
              transition
              relative
              active:scale-[0.99]
            "
          >
            {/* HINT */}
            <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition">
              <ExternalLink size={10} />
              Abrir
            </div>

            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(goal);
                  }}
                  className="mt-0.5"
                >
                  {done ? (
                    <CheckCircle2 size={20} className="text-purple-400" />
                  ) : (
                    <Circle size={20} className="text-zinc-600 hover:text-purple-400 transition" />
                  )}
                </button>

                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      done ? "line-through text-zinc-500" : "text-zinc-100"
                    }`}
                  >
                    {goal.title}
                  </p>

                  {goal.description && (
                    <p className="text-xs text-zinc-500 truncate">
                      {goal.description}
                    </p>
                  )}

                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    {STATUS_LABEL[goal.status]}
                  </span>
                </div>
              </div>

              <div
                className="flex gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onEdit(goal)}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
                >
                  <Pencil size={14} />
                </button>

                <button
                  onClick={() => onDelete(goal)}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-red-500/20"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 text-[11px] text-zinc-400">
              <span className={`${PRIORITY_COLOR[goal.priority]} flex items-center gap-1`}>
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
                  <AlertTriangle size={10} />
                  Atrasada
                </span>
              )}
            </div>

            {/* PROGRESS */}
            <div>
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Progresso</span>
                <span>{goal.progress}%</span>
              </div>

              <div className="h-1.5 bg-zinc-800 rounded mt-1 overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            {/* KPIS */}
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="text-zinc-500 flex items-center gap-1 mb-1">
                  <Activity size={10} />
                  Score
                </div>
                <div className="text-purple-400 font-semibold">
                  {goal.score ?? 0}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="text-zinc-500 flex items-center gap-1 mb-1">
                  <Brain size={10} />
                  Health
                </div>
                <div
                  className={`font-semibold ${
                    health >= 70
                      ? "text-emerald-400"
                      : health >= 40
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {health}
                </div>
              </div>

              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="text-zinc-500 mb-1">Tasks</div>
                <div className="text-purple-300 font-semibold">
                  {doneTasks}/{totalTasks}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}