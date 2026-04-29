"use client";

import { Plus } from "lucide-react";

type Filter = "ALL" | "ACTIVE" | "COMPLETED";

type Props = {
  onCreate: () => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
};

export default function TasksHeader({
  onCreate,
  filter,
  setFilter,
}: Props) {
  return (
    <div className="flex items-center justify-between">

      {/* TITLE */}
      <h1 className="text-xl font-semibold">
        Tarefas
      </h1>

      {/* FILTER */}
      <div className="flex gap-2 text-xs">

        {(["ALL", "ACTIVE", "COMPLETED"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-1 rounded-md border transition ${
              filter === f
                ? "bg-purple-600/20 border-purple-400 text-purple-400"
                : "border-zinc-700 text-zinc-400"
            }`}
          >
            {f}
          </button>
        ))}

      </div>

      {/* CREATE */}
      <button
        onClick={onCreate}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-xl text-sm font-medium"
      >
        <Plus size={16} />
        Nova tarefa
      </button>

    </div>
  );
}