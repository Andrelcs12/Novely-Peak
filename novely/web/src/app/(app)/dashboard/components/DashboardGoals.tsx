"use client";

import { Target, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

// 🔥 PADRÃO UNIFICADO (igual backend)
type Task = {
  id: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

type Goal = {
  id: string;
  title: string;
  progress: number;
  tasks: Task[];
};

export default function DashboardGoals({
  goals,
}: {
  goals: Goal[];
}) {
  if (!goals.length) {
    return (
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-zinc-400">
        <div className="mb-2 text-white font-medium">
          Nenhuma meta ainda
        </div>

        <div>
          Defina uma meta para direcionar sua execução.
        </div>

        <Link
          href="/goals"
          className="inline-flex items-center gap-1 mt-4 text-purple-400 hover:text-purple-300 text-xs"
        >
          Criar meta <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const activeGoals = goals.slice(0, 3);

  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-zinc-400">
            Metas em execução
          </div>

          <div className="text-xs text-zinc-500">
            {goals.length} metas ativas
          </div>
        </div>

        <Link
          href="/goals"
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
        >
          Ver tudo <ArrowRight size={14} />
        </Link>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {activeGoals.map((goal) => {
          const total = goal.tasks.length;

          const done = goal.tasks.filter(
            (t) => t.status === "DONE"
          ).length;

          const realProgress = total
            ? Math.round((done / total) * 100)
            : goal.progress;

          return (
            <div
              key={goal.id}
              className="p-4 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/70 transition group"
            >
              {/* TOP */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <Target size={16} />
                  </div>

                  <span className="text-sm text-zinc-200 group-hover:text-white transition">
                    {goal.title}
                  </span>
                </div>

                <span className="text-xs text-purple-400 font-medium">
                  {realProgress}%
                </span>
              </div>

              {/* PROGRESS BAR */}
              <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${realProgress}%` }}
                />
              </div>

              {/* STATS */}
              <div className="flex items-center justify-between text-xs text-zinc-400">

                <div className="flex items-center gap-3">

                  <div className="flex items-center gap-1">
                    <Circle size={14} className="text-zinc-500" />
                    <span>{total} tarefas</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-green-400" />
                    <span>{done} concluídas</span>
                  </div>

                </div>

                <Link
                  href={`/goals`}
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  Abrir <ArrowRight size={12} />
                </Link>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}