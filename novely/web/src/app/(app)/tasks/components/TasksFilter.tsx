"use client";

import { Search, SlidersHorizontal } from "lucide-react";

type Props = {
  search: string;
  setSearch: (v: string) => void;

  priority: "ALL" | "LOW" | "MEDIUM" | "HIGH";
  setPriority: (v: "ALL" | "LOW" | "MEDIUM" | "HIGH") => void;
};

export default function TasksFilters({
  search,
  setSearch,
  priority,
  setPriority,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">

     <div className="flex items-center gap-2 flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 transition focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/40">
  <Search size={16} className="text-zinc-500" />
  
  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Buscar tarefas..."
    className="bg-transparent outline-none text-sm w-full placeholder:text-zinc-500"
  />
</div>

      {/* PRIORITY FILTER */}
      <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
        {["ALL", "LOW", "MEDIUM", "HIGH"].map((p) => (
          <button
            key={p}
            onClick={() => setPriority(p as any)}
            className={`px-3 cursor-pointer py-1.5 text-xs rounded-lg transition ${
              priority === p
                ? "bg-purple-600 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {p === "ALL" && "Todas"}
            {p === "LOW" && "Baixa"}
            {p === "MEDIUM" && "Média"}
            {p === "HIGH" && "Alta"}
          </button>
        ))}
      </div>

    </div>
  );
}