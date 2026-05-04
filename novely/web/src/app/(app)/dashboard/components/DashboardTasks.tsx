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
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string | null;
  category?: string | null;
  completedAt?: string | null;
};

export default function DashboardTasks({
  tasks,
  onReload,
}: {
  tasks: Task[];
  onReload?: () => void;
}) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  // 🔥 sincroniza quando backend atualizar
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const pending = localTasks.filter((t) => t.status !== "DONE");
  const completed = localTasks.filter((t) => t.status === "DONE");

  const focusTasks = [...pending]
    .sort((a, b) => {
      const order = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return order[b.priority ?? "LOW"] - order[a.priority ?? "LOW"];
    })
    .slice(0, 5);

  const recentCompleted = [...completed]
    .sort(
      (a, b) =>
        new Date(b.completedAt || 0).getTime() -
        new Date(a.completedAt || 0).getTime()
    )
    .slice(0, 2);

  const getPriorityColor = (priority?: string) => {
    if (priority === "HIGH") return "text-red-400";
    if (priority === "MEDIUM") return "text-yellow-400";
    return "text-zinc-500";
  };

  const formatDate = (date?: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getStatusLabel = (status: string) => {
    if (status === "IN_PROGRESS") return "Em execução";
    if (status === "DONE") return "Concluído";
    return "Fazer";
  };

  // 🔥 AQUI ESTÁ A MÁGICA (optimistic update)
  const handleComplete = async (id: string) => {
    // 1. UI atualiza INSTANTE
    setLocalTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "DONE",
              completedAt: new Date().toISOString(),
            }
          : t
      )
    );

    try {
      setLoadingIds((prev) => [...prev, id]);

      // 2. backend roda depois
      await api.patch(`/tasks/${id}/status`, {
        status: "DONE",
      });

      // 🔥 ADICIONAR AQUI
      window.dispatchEvent(new Event("streak_updated"));

      onReload?.(); // opcional
    } catch (err) {
      console.error(err);

      // fallback: recarrega estado real
      onReload?.();
    } finally {
      setLoadingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  if (!localTasks.length) {
    return (
      <div className="p-6 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 text-sm text-zinc-400">
        <div className="mb-2 text-white font-medium">
          Nenhuma tarefa ainda
        </div>

        <div>Crie sua primeira tarefa e comece a executar.</div>

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
          <div className="text-sm text-zinc-400">Foco do dia</div>

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

      {/* FOCUS */}
      <div className="space-y-2">
        <div className="text-xs text-zinc-500 uppercase tracking-wide">
          Em execução agora
        </div>

        {focusTasks.length === 0 ? (
          <div className="text-sm text-green-400">
            Tudo concluído. Mantenha consistência.
          </div>
        ) : (
          focusTasks.map((task) => {
            const isLoading = loadingIds.includes(task.id);

            return (
              <div
                key={task.id}
                className="flex items-center justify-between text-sm px-3 py-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/70 transition"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleComplete(task.id)}
                      disabled={isLoading}
                    >
                      <Circle
                        size={16}
                        className="text-zinc-500 hover:text-green-400"
                      />
                    </button>

                    <span className="text-zinc-200">
                      {task.title}
                    </span>
                  </div>

                  <div className="flex gap-3 text-xs text-zinc-500">
                    {task.priority && (
                      <span className={`flex gap-1 ${getPriorityColor(task.priority)}`}>
                        <Flame size={12} />
                        {task.priority}
                      </span>
                    )}

                    {task.dueDate && (
                      <span className="flex gap-1">
                        <Calendar size={12} />
                        {formatDate(task.dueDate)}
                      </span>
                    )}

                    {task.category && (
                      <span className="flex gap-1">
                        <Tag size={12} />
                        {task.category}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs text-yellow-400">
                  {isLoading ? "..." : getStatusLabel(task.status)}
                </span>
              </div>
            );
          })
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
                {task.completedAt
                  ? `Hoje • ${formatDate(task.completedAt)}`
                  : "Concluído"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}