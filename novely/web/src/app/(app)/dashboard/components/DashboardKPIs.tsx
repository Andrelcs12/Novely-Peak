"use client";

import { CheckSquare, Target, Zap } from "lucide-react";

type Props = {
  tasks: number;
  goals: number;
  productivity: number;
};

export default function DashboardKPIs({
  tasks,
  goals,
  productivity,
}: Props) {
  const items = [
    {
      label: "Tarefas",
      value: tasks,
      icon: CheckSquare,
    },
    {
      label: "Metas",
      value: goals,
      icon: Target,
    },
    {
      label: "Produtividade",
      value: `${productivity}%`,
      icon: Zap,
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className={`
              p-4 rounded-xl border transition
              ${
                item.highlight
                  ? "bg-purple-600/10 border-purple-500/30"
                  : "bg-zinc-900 border-zinc-800"
              }
            `}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                {item.label}
              </span>

              <Icon
                size={16}
                className={
                  item.highlight
                    ? "text-purple-400"
                    : "text-zinc-500"
                }
              />
            </div>

            {/* VALUE */}
            <div
              className={`text-2xl font-bold mt-2 ${
                item.highlight
                  ? "text-purple-400"
                  : "text-white"
              }`}
            >
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}