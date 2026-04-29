"use client";

import { CheckCircle2, ListTodo, TrendingUp, AlertCircle } from "lucide-react";

type Props = {
  total: number;
  completed: number;
  highPriority?: number;
  overdue?: number;
};

export default function TasksStats({
  total,
  completed,
  highPriority = 0,
  overdue = 0,
}: Props) {
  const percent = total
    ? Math.round((completed / total) * 100)
    : 0;

  const pending = total - completed;

  // 🔥 insight simples (já começa a dar inteligência)
  const getInsight = () => {
    if (total === 0) return "Crie sua primeira tarefa para começar.";
    if (percent === 100) return "Tudo concluído. Excelente consistência.";
    if (overdue > 0) return "Você tem tarefas atrasadas. Priorize resolver.";
    if (highPriority > 0 && pending > 0)
      return "Foque nas tarefas de alta prioridade.";
    if (percent < 40) return "Baixo progresso. Execute pequenas ações.";
    return "Bom progresso. Continue consistente.";
  };

  return (
    <div className="space-y-4">

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {/* TOTAL */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ListTodo size={14} />
            Total
          </div>
          <div className="text-xl font-bold mt-1">
            {total}
          </div>
        </div>

        {/* COMPLETED */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle2 size={14} />
            Concluídas
          </div>
          <div className="text-xl font-bold mt-1 text-purple-400">
            {completed}
          </div>
        </div>

        {/* PROGRESS */}
        <div className="p-4 bg-purple-600/10 border border-purple-500/30 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <TrendingUp size={14} />
            Progresso
          </div>
          <div className="text-xl font-bold mt-1 text-purple-400">
            {percent}%
          </div>

          {/* barra visual */}
          <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* ALERT */}
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <AlertCircle size={14} />
            Atenção
          </div>
          <div className="text-xl font-bold mt-1 text-red-400">
            {overdue}
          </div>
          <div className="text-[10px] text-zinc-500">
            atrasadas
          </div>
        </div>

      </div>

      {/* INSIGHT */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-400">
        {getInsight()}
      </div>

    </div>
  );
}