"use client";

import { Goal } from "@/app/types/goal";
import { Target, Calendar, TrendingUp, CheckCircle2, ListTodo } from "lucide-react";

type Props = {
  goals: Goal[];
  onSelect: (goal: Goal) => void;
};

export default function GoalsHistory7d({ goals, onSelect }: Props) {
  const filtered = goals
    .filter((g) => g.createdAt)
    .sort(
      (a, b) =>
        new Date(b.createdAt!).getTime() -
        new Date(a.createdAt!).getTime()
    );

  const total = filtered.length;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });

  const getTasksInfo = (goal: Goal) => {
    const totalTasks = goal.tasks?.length ?? 0;
    const doneTasks =
      goal.tasks?.filter((t) => t.status === "DONE").length ?? 0;

    const progress =
      totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    return { totalTasks, doneTasks, progress };
  };

  if (!filtered.length) {
    return (
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-400">
        Nenhuma meta criada nos últimos 7 dias
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-zinc-500">
            Histórico de metas
          </div>
          <div className="text-white font-semibold">
            Últimos 7 dias
          </div>
        </div>

        <div className="text-xs text-purple-400 font-medium">
          {total} metas
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {filtered.slice(0, 7).map((goal) => {
          const { totalTasks, doneTasks, progress } =
            getTasksInfo(goal);

          return (
            <div
              key={goal.id}
              onClick={() => onSelect(goal)}
              className="
                group
                flex flex-col gap-2
                px-3 py-3
                rounded-lg
                bg-zinc-800/40 hover:bg-zinc-800/70
                cursor-pointer
                transition
                border border-zinc-800
              "
            >

              {/* TOP LINE */}
              <div className="flex items-center justify-between">

                {/* TITLE */}
                <div className="flex items-center gap-2 min-w-0">
                  <Target size={14} className="text-purple-400 shrink-0" />

                  <span className="text-sm text-zinc-200 truncate">
                    {goal.title}
                  </span>
                </div>

                {/* DATE */}
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Calendar size={12} />
                  {formatDate(goal.createdAt)}
                </div>

              </div>

              {/* METRICS */}
              <div className="flex items-center justify-between text-xs">

                {/* TASKS */}
                <div className="flex items-center gap-1 text-zinc-400">
                  <ListTodo size={12} />
                  {doneTasks}/{totalTasks} tasks
                </div>

                {/* PROGRESS */}
                <div className="flex items-center gap-1 text-purple-400 font-medium">
                  <TrendingUp size={12} />
                  {progress}%
                </div>

              </div>

              {/* PROGRESS BAR */}
              <div className="h-1.5 bg-zinc-800 rounded overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* STATUS SMALL INDICATOR */}
              <div className="flex items-center justify-between text-[10px] text-zinc-500">

                <div className="flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  {goal.status}
                </div>

                {goal.riskLevel && (
                  <div className="text-zinc-400">
                    Risk: {goal.riskLevel}
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}