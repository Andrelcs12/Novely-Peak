"use client";

import { useMemo, useState } from "react";
import { Task } from "@/app/types/task";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
} from "recharts";

type Props = {
  tasks: Task[];
};

export default function TasksAnalytics({ tasks }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const completed = tasks.filter(t => t.status === "DONE").length;
  const total = tasks.length;

  const percent = total ? Math.round((completed / total) * 100) : 0;

  const priorityData = useMemo(() => {
    const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };

    tasks.forEach(t => {
      counts[t.priority]++;
    });

    return [
      {
        name: "Alta",
        value: counts.HIGH,
        color: "#a78bfa", // roxo forte
      },
      {
        name: "Média",
        value: counts.MEDIUM,
        color: "#c4b5fd", // roxo médio
      },
      {
        name: "Baixa",
        value: counts.LOW,
        color: "#ddd6fe", // roxo claro
      },
    ];
  }, [tasks]);

  const progressData = [
    { name: "Concluído", value: completed },
    { name: "Restante", value: total - completed },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* PROGRESSO */}
      <div className="bg-zinc-900 border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/40 transition">
        <h3 className="text-sm text-zinc-400 mb-3">
          Progresso
        </h3>

        <div className="relative h-40 flex items-center justify-center">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={progressData}
                innerRadius={45}
                outerRadius={65}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="#8B5CF6" />
                <Cell fill="#27272A" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute flex flex-col items-center">
            <span className="text-lg font-semibold text-white">
              {percent}%
            </span>
            <span className="text-[10px] text-zinc-500">
              concluído
            </span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-zinc-400 mt-2">
          <span>{completed} feitas</span>
          <span>{total - completed} restantes</span>
        </div>
      </div>

      {/* PRIORIDADE */}
      <div className="bg-zinc-900 border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/40 transition">
        <h3 className="text-sm text-zinc-400 mb-3">
          Prioridade
        </h3>

        <div className="h-40">
          <ResponsiveContainer>
            <BarChart data={priorityData}>
              <XAxis
                dataKey="name"
                stroke="#71717A"
                tick={{ fontSize: 12 }}
              />

              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {priorityData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      activeIndex === index
                        ? "#8B5CF6" // roxo principal no hover
                        : entry.color
                    }
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      console.log("Filtro por:", entry.name);
                      // 👉 aqui você pode integrar filtro depois
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* LEGENDA */}
        <div className="flex justify-between text-xs mt-3">
          {priorityData.map((p, i) => (
            <div
              key={p.name}
              className={`flex items-center gap-1 cursor-pointer transition ${
                activeIndex === i ? "text-white" : "text-zinc-400"
              }`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background:
                    activeIndex === i ? "#8B5CF6" : p.color,
                }}
              />
              {p.name}: {p.value}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}