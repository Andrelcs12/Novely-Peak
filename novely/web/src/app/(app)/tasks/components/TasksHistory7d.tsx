"use client";

import { Task } from "@/app/types/task";
import { CheckCircle2, Calendar, Timer } from "lucide-react";

type Props = {
  tasks: Task[];
  onOpen: (task: Task) => void;
};

export default function TasksHistory7d({ tasks, onOpen }: Props) {
  const completed = tasks
    .filter((t) => t.status === "DONE" && t.completedAt)
    .sort(
      (a, b) =>
        new Date(b.completedAt!).getTime() -
        new Date(a.completedAt!).getTime()
    );

  const total = completed.length;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });

  const getDuration = (task: Task) => {
    const start = (task as any).startedAt;
    const end = task.completedAt;

    if (!start || !end) return null;

    const diff = Math.floor(
      (new Date(end).getTime() - new Date(start).getTime()) / 60000
    );

    if (diff < 1) return "< 1min";
    if (diff < 60) return `${diff}min`;

    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  if (!completed.length) {
    return (
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-400">
        Nenhuma tarefa concluída nos últimos 7 dias
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-zinc-500">Histórico de execução</div>
          <div className="text-white font-semibold">Últimos 7 dias</div>
        </div>

        <div className="text-xs text-green-400 font-medium">
          {total} concluídas
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {completed.slice(0, 7).map((task) => {
          const duration = getDuration(task);

          return (
            <div
              key={task.id}
              onClick={() => onOpen(task)}
              className="
                cursor-pointer
                flex flex-col sm:flex-row sm:items-center sm:justify-between
                gap-2 px-3 py-3 rounded-xl
                bg-zinc-800/40 hover:bg-zinc-800/70 transition
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-2 text-sm text-zinc-200 min-w-0">
                <CheckCircle2 size={14} className="text-green-400 shrink-0" />
                <span className="truncate">{task.title}</span>
              </div>

              {/* RIGHT */}
              <div className="flex flex-wrap sm:justify-end gap-3 text-xs text-zinc-500">

                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(task.completedAt!)}
                </div>

                {duration && (
                  <div className="flex items-center gap-1 text-blue-400">
                    <Timer size={12} />
                    {duration}
                  </div>
                )}

                <span className="px-2 py-0.5 rounded bg-zinc-700 text-[10px] uppercase">
                  {task.priority}
                </span>

                <span className="text-green-400">concluído</span>
              </div>
            </div>
          );
        })}
      </div>

      {total > 7 && (
        <div className="text-xs text-zinc-500 text-center">
          +{total - 7} tarefas concluídas
        </div>
      )}
    </div>
  );
}