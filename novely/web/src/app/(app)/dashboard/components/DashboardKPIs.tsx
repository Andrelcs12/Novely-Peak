"use client";

import StatCard from "@/app/components/ui/StatCard";
import { CheckSquare, Target, Zap, CheckCircle2 } from "lucide-react";

type Props = {
  tasks: number;
  completedTasks: number;
  goals: number;
  productivity: number;
  last7dCompleted: number; // 🔥 novo
};

export default function DashboardKPIs({
  tasks,
  completedTasks,
  goals,
  productivity,
  last7dCompleted,
}: Props) {

  const percent =
    tasks === 0 ? 0 : Math.round((completedTasks / tasks) * 100);

  const getProductivityColor = () => {
    if (productivity < 30) return "#ef4444";
    if (productivity < 70) return "#eab308";
    return "#22c55e";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      <StatCard
        label="Execução de tarefas"
        value={`${completedTasks}/${tasks}`}
        icon={CheckSquare}
        color="#3b82f6"
      />

      <StatCard
        label="Metas ativas"
        value={goals}
        icon={Target}
        color="#22c55e"
      />

      <StatCard
        label="Taxa de execução"
        value={`${productivity}%`}
        icon={Zap}
        color={getProductivityColor()}
      />

      {/* 🔥 NOVO CARD */}
      <StatCard
        label="Concluídas (7 dias)"
        value={last7dCompleted}
        icon={CheckCircle2}
        color="#22c55e"
      />

    </div>
  );
}