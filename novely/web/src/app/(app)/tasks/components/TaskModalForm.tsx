"use client";

import {
  X,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Flag,
  Brain,
  Trash2,
  HelpCircle,
} from "lucide-react";

type Props = {
  title: string;
  setTitle: (v: string) => void;

  description: string;
  setDescription: (v: string) => void;

  dueDate: string;
  setDueDate: (v: string) => void;

  estimatedTime: number | "";
  setEstimatedTime: (v: number | "") => void;

  priority: "LOW" | "MEDIUM" | "HIGH";
  setPriority: (v: "LOW" | "MEDIUM" | "HIGH") => void;

  status: "TODO" | "IN_PROGRESS" | "DONE";
  toggleStatus: () => void;

  isEdit: boolean;
  handleSubmit: () => void;
  handleDelete: () => void;

  loading: boolean;
  error: string | null;

  isGeneric: boolean;
  isOverdue: boolean;
  qualityLabel: string;

  onOpenHelp: () => void;

  onClose: () => void;
};

export default function TaskModalForm({
  title = "",
  setTitle,
  description = "",
  setDescription,
  dueDate,
  setDueDate,
  estimatedTime,
  setEstimatedTime,
  priority,
  setPriority,
  status,
  toggleStatus,
  isEdit,
  handleSubmit,
  handleDelete,
  loading,
  error,
  isGeneric,
  isOverdue,
  onOpenHelp,
  qualityLabel,
  onClose,
}: Props) {
  return (
    <div className="bg-zinc-900 rounded-2xl md:rounded-none border border-zinc-800 md:border-0 p-6 space-y-6 w-full max-h-[90vh] overflow-y-auto">

      <div className="flex items-start justify-between">
  {/* LEFT */}
  <div className="flex items-center gap-2">
    <div>

        <div className="flex gap-2 items-center">

            <h2 className="text-lg font-semibold">
        {isEdit ? "Editar tarefa" : "Nova tarefa"}
      </h2>

      <button
      onClick={onOpenHelp}
      title="Como criar boas tarefas"
      className="p-1.5 cursor-pointer rounded-full hover:bg-zinc-800 transition"
    >
      <HelpCircle size={18} className="text-zinc-400 hover:text-white" />
    </button>
        </div>
      
      <p className="text-xs text-zinc-500">
        Clareza aumenta execução
      </p>
    </div>

    
  </div>

  {/* CLOSE */}
  <button
    onClick={onClose}
    className="p-2 cursor-pointer rounded-full hover:bg-zinc-800 transition"
  >
    <X size={18} />
  </button>
</div>

      {/* ALERTS */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {isGeneric && (
        <div className="flex items-center gap-2 text-xs text-yellow-400">
          <AlertCircle size={14} />
          Tarefa genérica. Especifique melhor.
        </div>
      )}

      {isOverdue && (
        <div className="flex items-center gap-2 text-xs text-red-400">
          <AlertCircle size={14} />
          Essa tarefa está atrasada
        </div>
      )}

      {/* QUALITY */}
      {title?.trim() && (
        <div className="flex items-center justify-between text-xs bg-zinc-800/50 border border-zinc-700 p-3 rounded-lg">
          <span className="flex items-center gap-1 text-zinc-400">
            <Brain size={12} />
            Qualidade
          </span>

          <span
            className={
              qualityLabel === "Ótima"
                ? "text-green-400"
                : qualityLabel === "Boa"
                ? "text-yellow-400"
                : "text-red-400"
            }
          >
            {qualityLabel}
          </span>
        </div>
      )}

      {/* TITLE */}
      <div className="space-y-1">
        <label className="text-xs text-zinc-400">
          O que exatamente você vai fazer?
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Fazer treino por 30min"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none 
          focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 
          hover:border-zinc-500 transition placeholder:text-zinc-500"
        />

        <p className="text-[10px] text-zinc-500">
          Ação clara + tempo definido = maior chance de execução
        </p>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1">
        <label className="text-xs text-zinc-400">
          Por que isso importa?
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Melhorar desempenho, cumprir prazo ou evoluir habilidade"
          rows={3}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none 
          focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 
          hover:border-zinc-500 resize-none transition placeholder:text-zinc-500"
        />

        <p className="text-[10px] text-zinc-500">
          Entender o motivo reduz procrastinação
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-3">

        {/* DATE */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-400 flex items-center gap-1">
            <Calendar size={12} />
            Prazo
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-sm outline-none 
            focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 
            hover:border-zinc-500 transition"
          />
        </div>

        {/* TIME */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-400 flex items-center gap-1">
            <Clock size={12} />
            Tempo (min)
          </label>

          <input
            type="number"
            placeholder="Ex: 30"
            min={1}
            max={600}
            value={estimatedTime}
            onChange={(e) =>
              setEstimatedTime(e.target.value ? Number(e.target.value) : "")
            }
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-sm outline-none 
            focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 
            hover:border-zinc-500 transition placeholder:text-zinc-500"
          />
        </div>
      </div>

      {/* PRIORITY */}
      <div className="space-y-2">
        <label className="text-xs text-zinc-400 flex items-center gap-1">
          <Flag size={12} />
          Prioridade
        </label>

        <div className="flex gap-2">
          {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`flex-1 py-2 rounded-lg text-xs border transition ${
                priority === p
                  ? p === "HIGH"
                    ? "bg-red-500/20 border-red-400 text-red-400"
                    : p === "MEDIUM"
                    ? "bg-yellow-500/20 border-yellow-400 text-yellow-400"
                    : "bg-green-500/20 border-green-400 text-green-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {p === "LOW" && "Baixa"}
              {p === "MEDIUM" && "Média"}
              {p === "HIGH" && "Alta"}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-zinc-500">
          Prioridade define ordem de execução
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={handleSubmit}
        disabled={!title?.trim() || loading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 
        transition py-2.5 rounded-lg text-sm font-medium active:scale-[0.99] 
        shadow-md shadow-purple-900/20"
      >
        {loading
          ? "Salvando..."
          : isEdit
          ? "Salvar tarefa"
          : "Criar tarefa"}
      </button>

      {/* STATUS */}
      {isEdit && (
        <button
          onClick={toggleStatus}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
        >
          <CheckCircle2
            size={16}
            className={
              status === "DONE"
                ? "text-green-400"
                : status === "IN_PROGRESS"
                ? "text-yellow-400"
                : "text-zinc-500"
            }
          />

          {status === "TODO" && "Iniciar tarefa"}
          {status === "IN_PROGRESS" && "Concluir tarefa"}
          {status === "DONE" && "Reabrir tarefa"}
        </button>
      )}

      {/* DELETE */}
      {isEdit && (
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 text-red-400 border border-red-500/20 rounded-lg py-2 text-sm hover:bg-red-500/10 transition"
        >
          <Trash2 size={14} />
          Excluir tarefa
        </button>
      )}
    </div>
  );
}