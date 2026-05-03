"use client";

import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Flame,
  Calendar,
  Tag,
} from "lucide-react";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string | null;
  category?: string | null;
};

export default function DashboardTasks({
  tasks,
}: {
  tasks: Task[];
}) {
  const pending = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  // Prioriza HIGH > MEDIUM > resto
  const focusTasks = [...pending]
    .sort((a, b) => {
      const order = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return (order[b.priority ?? "LOW"] - order[a.priority ?? "LOW"]);
    })
    .slice(0, 3);

  const recentCompleted = completed.slice(0, 2);

  const getPriorityColor = (priority?: string) => {
    if (priority === "HIGH") return "text-red-400";
    if (priority === "MEDIUM") return "text-yellow-400";
    return "text-zinc-500";
  };

  const formatDate = (date?: string | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  if (!tasks.length) {
    return (
      <div className="p-6 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 text-sm text-zinc-400">
        <div className="mb-2 text-white font-medium">
          Nenhuma tarefa ainda
        </div>

        <div>
          Crie sua primeira tarefa e comece a executar.
        </div>

        <Link
          href="/tasks"
          className="inline-flex items-center gap-1 mt-4 text-purple-400 hover:text-purple-300 text-xs"
        >
          Criar tarefa <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-zinc-400">
            Foco do dia
          </div>

          <div className="text-lg font-semibold text-white">
            Execute o essencial
          </div>

          <div className="text-xs text-zinc-500 mt-1">
            {pending.length} pendentes • {completed.length} concluídas
          </div>
        </div>

        <Link
          href="/tasks"
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
        >
          Ver tudo <ArrowRight size={14} />
        </Link>
      </div>

      {/* FOCUS TASKS */}
      <div className="space-y-2">
        <div className="text-xs text-zinc-500 uppercase tracking-wide">
          Em execução agora
        </div>

        {focusTasks.length === 0 ? (
          <div className="text-sm text-green-400">
            Tudo concluído. Mantenha consistência.
          </div>
        ) : (
          focusTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between text-sm px-3 py-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/70 transition group"
            >
              {/* LEFT */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Circle
                    size={16}
                    className="text-zinc-500 group-hover:text-purple-400 transition"
                  />

                  <span className="text-zinc-200 group-hover:text-white transition">
                    {task.title}
                  </span>
                </div>

                {/* META INFO */}
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  {task.priority && (
                    <span className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                      <Flame size={12} />
                      {task.priority}
                    </span>
                  )}

                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(task.dueDate)}
                    </span>
                  )}

                  {task.category && (
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      {task.category}
                    </span>
                  )}
                </div>
              </div>

              {/* STATUS */}
              <span className="text-xs text-yellow-400 opacity-70 group-hover:opacity-100">
                Fazer
              </span>
            </div>
          ))
        )}
      </div>

      {/* COMPLETED */}
      {recentCompleted.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-zinc-500 uppercase tracking-wide">
            Concluídas
          </div>

          {recentCompleted.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between text-sm px-3 py-2 rounded-lg bg-zinc-800/30"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" />

                <span className="line-through text-zinc-500">
                  {task.title}
                </span>
              </div>

              <span className="text-xs text-green-400">
                OK
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}