"use client";

import { Goal } from "@/app/types/goal";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

import { Target, TrendingUp } from "lucide-react";

type Props = {
  goals: Goal[];
};

const COLORS = {
  primary: "#8b5cf6",
  success: "#22c55e",
  warning: "#f59e0b",
};

export default function GoalsAnalytics({ goals }: Props) {
  const total = goals.length;

  const completed = goals.filter(g => g.status === "COMPLETED").length;
  const active = goals.filter(g => g.status === "ACTIVE").length;
  const paused = goals.filter(g => g.status === "PAUSED").length;

  const avgProgress = total
    ? Math.round(goals.reduce((a, g) => a + (g.progress || 0), 0) / total)
    : 0;

  if (!total) {
    return (
      <div className="p-6 text-center border border-zinc-800 rounded-xl bg-zinc-900 text-zinc-400 text-sm">
        Nenhuma meta encontrada para análise
      </div>
    );
  }

  const statusData = [
    { name: "Ativas", value: active, color: COLORS.primary },
    { name: "Concluídas", value: completed, color: COLORS.success },
    { name: "Pausadas", value: paused, color: COLORS.warning },
  ];

  const progressData = [
    { name: "0-25%", value: goals.filter(g => g.progress < 25).length },
    { name: "25-50%", value: goals.filter(g => g.progress >= 25 && g.progress < 50).length },
    { name: "50-75%", value: goals.filter(g => g.progress >= 50 && g.progress < 75).length },
    { name: "75-100%", value: goals.filter(g => g.progress >= 75).length },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* ================= STATUS ================= */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-zinc-300 mb-2">
          <Target size={16} />
          Status das metas
        </div>

        <div className="h-44">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={statusData} dataKey="value" outerRadius={65}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 space-y-1 text-xs text-zinc-400">
          {statusData.map((s, i) => (
            <div key={i} className="flex justify-between">
              <span>{s.name}</span>
              <span className="text-white">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PROGRESS ================= */}
      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-zinc-300 mb-2">
          <TrendingUp size={16} />
          Distribuição de progresso
        </div>

        <div className="h-44">
          <ResponsiveContainer>
            <BarChart data={progressData}>
              <XAxis dataKey="name" stroke="#71717A" />
              <Tooltip />
              <Bar dataKey="value" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-3 text-xs text-zinc-400">
          {progressData.map((b, i) => (
            <div
              key={i}
              className="p-2 bg-zinc-950 border border-zinc-800 rounded text-center"
            >
              <div>{b.name}</div>
              <div className="text-purple-400 font-semibold">
                {b.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PROGRESSO GLOBAL ================= */}
      <div className="md:col-span-2 p-4 rounded-xl bg-zinc-900 border border-zinc-800">

        <div className="flex justify-between text-sm text-zinc-400 mb-2">
          <span>Progresso médio do sistema</span>
          <span className="text-purple-400">{avgProgress}%</span>
        </div>

        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all"
            style={{ width: `${avgProgress}%` }}
          />
        </div>

      </div>

    </div>
  );
}