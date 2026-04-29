"use client";

import { User } from "@/app/types/user";

export default function DashboardInsight({
  user,
}: {
  user: User;
}) {
  const getInsight = () => {
    if (!user) return "Carregando...";

    if (user.discipline === "LOW") {
      return "Comece com tarefas pequenas e consistentes.";
    }

    if (user.workStyle === "MINIMAL") {
      return "Menos tarefas, mais foco. Evite sobrecarga.";
    }

    if (user.goal === "STUDY") {
      return "Consistência diária supera intensidade.";
    }

    if (user.goal === "WORK") {
      return "Priorize tarefas de alto impacto.";
    }

    return "Organize seu dia para manter consistência.";
  };

  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className="text-sm text-zinc-400">
        Insight do dia
      </div>

      <div className="mt-2 text-white">
        {getInsight()}
      </div>
    </div>
  );
}