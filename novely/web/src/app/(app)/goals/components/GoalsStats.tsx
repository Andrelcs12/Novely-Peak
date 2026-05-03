"use client";

import StatCard from "@/app/components/ui/StatCard";
import {
  Target,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Goal } from "@/app/types/goal";

type Props = {
  goals: Goal[];
};

export default function GoalsStats({ goals }: Props) {
  const total = goals.length;

  const completed = goals.filter(g => g.status === "COMPLETED").length;
  const active = goals.filter(g => g.status === "ACTIVE").length;

  const atRisk = goals.filter(
    g => g.riskLevel === "HIGH" || (g.healthScore ?? 0) < 40
  ).length;

  const avgProgress =
    total > 0
      ? Math.round(goals.reduce((a, g) => a + (g.progress || 0), 0) / total)
      : 0;

  return (
    <div className="space-y-4">

      {/* KPIs principais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <StatCard
          label="Total"
          value={total}
          icon={Target}
          color="#8b5cf6"
        />

        <StatCard
          label="Ativas"
          value={active}
          icon={TrendingUp}
          color="#a855f7"
        />

        <StatCard
          label="Concluídas"
          value={completed}
          icon={CheckCircle2}
          color="#22c55e"
        />

        <StatCard
          label="Em risco"
          value={atRisk}
          icon={AlertTriangle}
          color="#ef4444"
        />

      </div>

     

    </div>
  );
}