"use client";

import { useMemo } from "react";
import StatCard from "@/app/components/ui/StatCard";
import {
  CheckCircle2,
  ListTodo,
  TrendingUp,
  AlertCircle,
  ChartColumnDecreasing,
  Zap,
  Clock,
  Flame,
} from "lucide-react";
import { Task } from "@/app/types/task";

type Props = {
  tasks: Task[];
};

type Insight = {
  text: string;
  color: string;
  icon: any;
  priority: number;
};

export default function TasksStats({ tasks }: Props) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "DONE").length;
  const pending = total - completed;

  const percent = total
    ? Math.round((completed / total) * 100)
    : 0;

  const overdue = tasks.filter(
    (t) =>
      t.dueDate &&
      new Date(t.dueDate) < new Date() &&
      t.status !== "DONE"
  ).length;

  const highPriority = tasks.filter(
    (t) => t.priority === "HIGH" && t.status !== "DONE"
  ).length;

  // 🔥 contexto do dia
  const todayCompleted = tasks.filter((t) => {
    if (t.status !== "DONE") return false;
    const today = new Date().toDateString();
    return new Date(t.updatedAt).toDateString() === today;
  }).length;

  // 🔥 carga de tempo
  const totalTime = tasks
    .filter((t) => t.status !== "DONE")
    .reduce((acc, t) => acc + (t.estimatedTime || 0), 0);

  const loadStatus =
    totalTime <= 120
      ? { label: "Carga leve", color: "text-green-400" }
      : totalTime <= 300
      ? { label: "Carga moderada", color: "text-yellow-400" }
      : { label: "Sobrecarga", color: "text-red-400" };

  // 🚀 MULTI INSIGHTS
  const insights: Insight[] = useMemo(() => {
    const list: Insight[] = [];

    if (total === 0) {
      list.push({
        text: "Crie sua primeira tarefa para começar.",
        color: "text-purple-400",
        icon: Zap,
        priority: 1,
      });
    }

    if (overdue > 0) {
      list.push({
        text: `Você tem ${overdue} tarefa(s) atrasada(s). Resolva isso agora.`,
        color: "text-red-400",
        icon: AlertCircle,
        priority: 10,
      });
    }

    if (highPriority > 0) {
      list.push({
        text: `${highPriority} tarefa(s) de alta prioridade pendente(s). Foque nisso.`,
        color: "text-orange-400",
        icon: Flame,
        priority: 9,
      });
    }

    if (percent < 40 && total > 0) {
      list.push({
        text: "Execução baixa. Finalize 1 tarefa agora.",
        color: "text-orange-400",
        icon: TrendingUp,
        priority: 8,
      });
    }

    if (todayCompleted > 0) {
      list.push({
        text: `Você já concluiu ${todayCompleted} hoje. Continue o ritmo.`,
        color: "text-green-400",
        icon: CheckCircle2,
        priority: 6,
      });
    } else if (total > 0) {
      list.push({
        text: "Nenhuma tarefa concluída hoje. Comece por uma pequena.",
        color: "text-yellow-400",
        icon: Clock,
        priority: 7,
      });
    }

    if (percent === 100 && total > 0) {
      list.push({
        text: "Tudo concluído. Excelente consistência.",
        color: "text-green-400",
        icon: CheckCircle2,
        priority: 10,
      });
    }

    return list
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
  }, [tasks]);

  return (
    <div className="space-y-4">

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total"
          value={total}
          icon={ListTodo}
          color="#64748B"
        />

        <StatCard
          label="Concluídas"
          value={completed}
          icon={CheckCircle2}
          color="#22C55E"
        />

        <StatCard
          label="Progresso"
          value={`${percent}%`}
          icon={TrendingUp}
          color="#7C3AED"
        />

        <StatCard
          label="Atrasos"
          value={overdue}
          icon={AlertCircle}
          color="#EF4444"
        />
      </div>

      {/* INSIGHTS */}
      <div className="space-y-2">
        {insights.map((insight, i) => {
          const Icon = insight.icon;

          return (
            <div
              key={i}
              className={`p-3 flex gap-3 items-center rounded-xl bg-zinc-900/60 border border-zinc-800 text-sm ${insight.color}`}
            >
              <Icon size={16} />
              {insight.text}
            </div>
          );
        })}
      </div>

    
    {/* ESTADO DO DIA */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

  {/* HOJE */}
  <div className="relative overflow-hidden p-4 rounded-xl border border-green-500/20 bg-gradient-to-br from-zinc-900 to-zinc-950">

    {/* glow */}
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-500/10 blur-2xl rounded-full" />

    <div className="relative z-10 flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-500/10 text-green-400">
        <CheckCircle2 size={18} />
      </div>

      <div>
        <p className="text-xs text-zinc-500">
          Hoje
        </p>
        <p className="text-lg font-semibold text-white">
          {todayCompleted}
        </p>
      </div>
    </div>

    <p className="text-xs text-zinc-400 mt-3">
      tarefas concluídas hoje
    </p>

    {/* feedback */}
    <p className="text-xs mt-1 text-green-400">
      {todayCompleted === 0
        ? "Comece com 1 tarefa simples"
        : todayCompleted < 3
        ? "Bom início"
        : "Ótimo ritmo"}
    </p>
  </div>

  {/* CARGA */}
  <div className="relative overflow-hidden p-4 rounded-xl border border-purple-500/20 bg-gradient-to-br from-zinc-900 to-zinc-950">

    {/* glow */}
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 blur-2xl rounded-full" />

    <div className="relative z-10 flex items-center gap-3">
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
        <Clock size={18} />
      </div>

      <div>
        <p className="text-xs text-zinc-500">
          Carga do dia
        </p>
        <p className="text-lg font-semibold text-white">
          {totalTime} min
        </p>
      </div>
    </div>

    <p className={`text-xs mt-3 ${loadStatus.color}`}>
      {loadStatus.label}
    </p>

    {/* feedback */}
    <p className="text-xs text-zinc-400 mt-1">
      {totalTime === 0
        ? "Sem tarefas pendentes"
        : totalTime < 120
        ? "Carga leve, bom para avançar"
        : totalTime < 300
        ? "Atenção ao volume"
        : "Reduza escopo ou priorize"}
    </p>
  </div>

</div>


    </div>
  );
}