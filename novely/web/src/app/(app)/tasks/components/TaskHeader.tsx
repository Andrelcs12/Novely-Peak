"use client";

import { Plus, HelpCircle } from "lucide-react";

type Filter = "ALL" | "ACTIVE" | "COMPLETED";

type Props = {
  onCreate: () => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
  onOpenHelp: () => void; // ✅ ADICIONAR
};

export default function TasksHeader({
  onCreate,
  filter,
  setFilter,
  onOpenHelp,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

      {/* TITLE + HELP */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-white">
          Tarefas
        </h1>

        <button
          onClick={onOpenHelp} // ✅ usa prop
          className="p-1.5 cursor-pointer rounded-full hover:bg-zinc-800 transition"
        >
          <HelpCircle size={20} className="text-zinc-400 hover:text-white" />
        </button>
      </div>

      {/* FILTER */}
      <div className="flex md:justify-center justify-between gap-2 text-xs overflow-x-auto pb-1">
        {(["ALL", "ACTIVE", "COMPLETED"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 md:w-fit cursor-pointer w-full py-1.5 rounded-lg border whitespace-nowrap transition ${
              filter === f
                ? "bg-purple-600/20 border-purple-400 text-purple-400"
                : "border-zinc-700 text-zinc-400 hover:text-white"
            }`}
          >
            {f === "ALL" && "Todas"}
            {f === "ACTIVE" && "Ativas"}
            {f === "COMPLETED" && "Concluídas"}
          </button>
        ))}
      </div>

      {/* CREATE */}
      <button
        onClick={onCreate}
        className="flex cursor-pointer items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-xl text-sm font-medium w-full sm:w-auto"
      >
        <Plus size={16} />
        Nova tarefa
      </button>
    </div>
  );
}