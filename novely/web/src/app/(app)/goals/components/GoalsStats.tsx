"use client";

import { Target, CheckCircle2, TrendingUp, Pause } from "lucide-react";
import { Goal } from "@/app/types/goal";

type Props = {
  goals: Goal[];
};

export default function GoalsStats({ goals }: Props) {
  const total = goals.length;
  const completed = goals.filter((g) => g.status === "COMPLETED").length;
  const active = goals.filter((g) => g.status === "ACTIVE").length;
  const paused = goals.filter((g) => g.status === "PAUSED").length;

  const avgProgress =
    total > 0
      ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / total)
      : 0;

  const getInsight = () => {
    if (total === 0) return "Defina sua primeira meta para começar.";
    if (completed === total) return "Todas as metas concluídas. Defina novos desafios.";
    if (paused > active) return "Muitas metas pausadas. Retome o foco no que importa.";
    if (avgProgress < 30 && active > 0) return "Progresso baixo. Divida as metas em ações menores.";
    if (avgProgress >= 70) return "Ótimo progresso geral. Mantenha a consistência.";
    return "Continue avançando nas suas metas.";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Target size={14} />
            Total
          </div>
          <div className="text-xl font-bold mt-1">{total}</div>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle2 size={14} />
            Concluídas
          </div>
          <div className="text-xl font-bold mt-1 text-purple-400">{completed}</div>
        </div>

        <div className="p-4 bg-purple-600/10 border border-purple-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <TrendingUp size={14} />
            Progresso médio
          </div>
          <div className="text-xl font-bold mt-1 text-purple-400">{avgProgress}%</div>
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Pause size={14} />
            Pausadas
          </div>
          <div className="text-xl font-bold mt-1 text-yellow-400">{paused}</div>
        </div>

      </div>

      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-400">
        {getInsight()}
      </div>
    </div>
  );
}