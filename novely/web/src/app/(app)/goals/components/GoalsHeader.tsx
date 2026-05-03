"use client";

import { Plus, HelpCircle } from "lucide-react";

type Props = {
  onCreate: () => void;
  onOpenHelp: () => void;
};

export default function GoalsHeader({
  onCreate,
  onOpenHelp,
}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Metas</h1>

        <button
          onClick={onOpenHelp}
          className="p-2 rounded-full hover:bg-zinc-800 transition"
        >
          <HelpCircle size={18} className="text-zinc-400" />
        </button>
      </div>

      <button
        onClick={onCreate}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-sm"
      >
        <Plus size={16} />
        Nova meta
      </button>

    </div>
  );
}