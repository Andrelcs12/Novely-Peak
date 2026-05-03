"use client";

import { GoalFormState } from "./GoalsModal";

type Props = {
  form: GoalFormState;
  onChange: <K extends keyof GoalFormState>(
    field: K,
    value: GoalFormState[K]
  ) => void;
};

function Label({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-1">
      <label className="text-[11px] text-zinc-400 block">
        {title}
      </label>
      {hint && (
        <span className="text-[10px] text-zinc-600">
          {hint}
        </span>
      )}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 cursor-pointer"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white h-24 resize-none outline-none transition focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
    />
  );
}

export default function GoalFormFields({ form, onChange }: Props) {
  return (
    <div className="space-y-5">

      {/* TITLE */}
      <div>
        <Label
          title="Título da meta"
          hint="Seja claro e específico sobre o resultado esperado"
        />
        <Input
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Ex: Aumentar faturamento mensal em 20%"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <Label
          title="Descrição"
          hint="Detalhe o contexto ou estratégia (opcional)"
        />
        <Textarea
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Ex: Melhorar campanhas, otimizar funil e aumentar conversão..."
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* PRIORITY */}
        <div>
          <Label
            title="Prioridade"
            hint="Define o nível de importância dessa meta"
          />
          <Select
            value={form.priority}
            onChange={(e) =>
              onChange("priority", e.target.value as GoalFormState["priority"])
            }
          >
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
          </Select>
        </div>

        {/* STATUS */}
        <div>
          <Label
            title="Status"
            hint="Estado atual da meta dentro do seu fluxo"
          />
          <Select
            value={form.status}
            onChange={(e) =>
              onChange("status", e.target.value as GoalFormState["status"])
            }
          >
            <option value="ACTIVE">Ativa</option>
            <option value="PAUSED">Pausada</option>
            <option value="COMPLETED">Concluída</option>
            <option value="ABANDONED">Abandonada</option>
          </Select>
        </div>

      </div>
    </div>
  );
}