"use client";

import { Plus } from "lucide-react";

type Filter = "ALL" | "ACTIVE" | "COMPLETED" | "PAUSED";

type Props = {
  onCreate: () => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
};

const FILTER_LABELS: Record<Filter, string> = {
  ALL: "Todas",
  ACTIVE: "Ativas",
  COMPLETED: "Concluídas",
  PAUSED: "Pausadas",
};

export default function GoalsHeader({ onCreate, filter, setFilter }: Props) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">

      <h1 className="text-xl font-semibold">Metas</h1>

      {/* FILTERS */}
      <div className="flex gap-2 text-xs flex-wrap">
        {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-1 rounded-md border transition ${
              filter === f
                ? "bg-purple-600/20 border-purple-400 text-purple-400"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {/* CREATE */}
      <button
        onClick={onCreate}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-xl text-sm font-medium"
      >
        <Plus size={16} />
        Nova meta
      </button>

    </div>
  );
}