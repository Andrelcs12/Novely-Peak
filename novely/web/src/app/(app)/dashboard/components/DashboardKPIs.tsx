"use client";

import { CheckSquare, Target, Zap } from "lucide-react";

type Props = {
  tasks: number;
  completedTasks: number;
  goals: number;
  productivity: number;
};

export default function DashboardKPIs({
  tasks,
  completedTasks,
  goals,
  productivity,
}: Props) {

  const getProductivityColor = () => {
    if (productivity < 30) return "text-red-400";
    if (productivity < 70) return "text-yellow-400";
    return "text-green-400";
  };

  const percent =
    tasks === 0 ? 0 : Math.round((completedTasks / tasks) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

      {/* EXECUÇÃO */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition">
        <div className="flex items-center gap-4">

          <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <CheckSquare size={20} />
          </div>

          <div>
            <span className="text-sm text-zinc-400">
              Execução de tarefas
            </span>

            <div className="text-2xl font-bold text-white">
              {completedTasks}/{tasks}
            </div>

            <div className="text-xs text-zinc-500 mt-1">
              {tasks === 0 ? "Sem tarefas" : `${percent}% concluído`}
            </div>
          </div>

        </div>
      </div>

      {/* METAS */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition">
        <div className="flex items-center gap-4">

          <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-green-500/10 text-green-400">
            <Target size={20} />
          </div>

          <div>
            <span className="text-sm text-zinc-400">
              Metas ativas
            </span>

            <div className="text-2xl font-bold text-white">
              {goals}
            </div>
          </div>

        </div>
      </div>

      {/* PERFORMANCE */}
      <div className="p-5 rounded-2xl bg-purple-600/10 border border-purple-500/30 hover:border-purple-400/40 transition">
        <div className="flex items-center gap-4">

          <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Zap size={20} />
          </div>

          <div>
            <span className="text-sm text-zinc-400">
              Taxa de execução
            </span>

            <div className={`text-2xl font-bold ${getProductivityColor()}`}>
              {productivity}%
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}