"use client";

import {
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  tasks: number;
  completedTasks: number;
  productivity: number;
};

export default function DashboardInsight({
  tasks,
  completedTasks,
  productivity,
}: Props) {
  const router = useRouter();

  const getInsight = () => {
    if (tasks === 0) {
      return {
        icon: AlertTriangle,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        title: "Sem execução iniciada",
        message:
          "Você ainda não iniciou o dia. Defina uma tarefa simples para gerar tração.",
        action: "Criar tarefa",
      };
    }

    if (productivity === 0) {
      return {
        icon: Flame,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        title: "Execução travada",
        message:
          "Tarefas iniciadas, mas nenhuma concluída. Finalize uma agora para destravar o ritmo.",
        action: "Finalizar tarefa",
      };
    }

    if (productivity < 50) {
      return {
        icon: TrendingUp,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        title: "Baixa eficiência",
        message:
          "Você está iniciando mais do que finalizando. Priorize concluir antes de começar novas tarefas.",
        action: "Focar nas pendentes",
      };
    }

    if (productivity < 80) {
      return {
        icon: TrendingUp,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        title: "Ritmo consistente",
        message:
          "Bom progresso até aqui. Continue executando sem alternar contexto desnecessariamente.",
        action: "Continuar execução",
      };
    }

    return {
      icon: CheckCircle2,
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      title: "Alta performance",
      message:
        "Alto nível de execução. Mantenha o foco para fechar o dia com consistência.",
      action: "Revisar tarefas",
    };
  };

  const insight = getInsight();
  const Icon = insight.icon;

  return (
    <div
      className={`
        p-6 rounded-2xl border transition
        bg-zinc-900 ${insight.border}
      `}
    >
      <div className="flex items-start gap-4">

        <div
          className={`
            w-11 h-11 flex items-center justify-center rounded-xl
            ${insight.bg} ${insight.color}
          `}
        >
          <Icon size={20} />
        </div>

        <div className="flex-1">

          <div className="text-sm text-zinc-400">
            Insight do dia
          </div>

          <div className="mt-1 text-white font-semibold">
            {insight.title}
          </div>

          <div className="text-sm text-zinc-400 mt-1">
            {insight.message}
          </div>

          <button
            onClick={() => router.push("/tasks")}
            className="mt-3 text-xs text-purple-400 hover:text-purple-300 transition"
          >
            {insight.action} →
          </button>

        </div>

      </div>
    </div>
  );
}