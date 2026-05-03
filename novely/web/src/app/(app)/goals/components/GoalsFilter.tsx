"use client";

import {
  GoalPriorityFilter,
  GoalStatusFilter,
} from "@/app/types/goal";
import { Search, Flag, ListChecks } from "lucide-react";

type Props = {
  search: string;
  setSearch: (v: string) => void;

  priority: GoalPriorityFilter;
  setPriority: (v: GoalPriorityFilter) => void;

  status: GoalStatusFilter;
  setStatus: (v: GoalStatusFilter) => void;
};

export default function GoalsFilter({
  search,
  setSearch,
  priority,
  setPriority,
  status,
  setStatus,
}: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">

      {/* SEARCH */}
      <div className="flex items-center gap-2 flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 transition focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/40">
        <Search size={16} className="text-zinc-500" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar metas..."
          className="bg-transparent outline-none text-sm w-full placeholder:text-zinc-500"
        />
      </div>

      {/* STATUS */}
      <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
        {(["ALL", "ACTIVE", "PAUSED", "COMPLETED"] as GoalStatusFilter[]).map(
          (s) => {
            const active = status === s;

            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`
                  px-3 py-1.5 text-xs rounded-lg transition flex items-center gap-1
                  ${active
                    ? "bg-purple-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  }
                `}
              >
                {s === "ALL" && <ListChecks size={12} />}
                {s === "ACTIVE" && "Ativas"}
                {s === "PAUSED" && "Pausadas"}
                {s === "COMPLETED" && "Concluídas"}
                {s === "ALL" && "Todas"}
              </button>
            );
          }
        )}
      </div>

      {/* PRIORITY */}
      <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
        {(["ALL", "LOW", "MEDIUM", "HIGH"] as GoalPriorityFilter[]).map(
          (p) => {
            const active = priority === p;

            return (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`
                  px-3 py-1.5 text-xs rounded-lg transition flex items-center gap-1
                  ${active
                    ? "bg-purple-600 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                  }
                `}
              >
                {p === "ALL" && <Flag size={12} />}
                {p === "ALL" && "Todas"}
                {p === "LOW" && "Baixa"}
                {p === "MEDIUM" && "Média"}
                {p === "HIGH" && "Alta"}
              </button>
            );
          }
        )}
      </div>

    </div>
  );
}