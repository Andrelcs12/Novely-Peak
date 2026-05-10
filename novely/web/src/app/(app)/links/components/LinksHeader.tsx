"use client";

import {
  Link2,
  Plus,
  Search,
} from "lucide-react";

import { LinkType } from "../types/link";

type Props = {
  total: number;

  onCreate: () => void;

  search: string;
  setSearch: (value: string) => void;

  filter: LinkType | "ALL";
  setFilter: (
    value: LinkType | "ALL"
  ) => void;
};

const FILTERS = [
  "ALL",
  "ARTICLE",
  "VIDEO",
  "GITHUB",
  "TWITTER",
];

export default function LinksHeader({
  total,
  onCreate,
  search,
  setSearch,
  filter,
  setFilter,
}: Props) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 space-y-5">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div className="space-y-2">
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
              <Link2
                size={20}
                className="text-violet-400"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                Links
              </h1>

              <p className="text-sm text-zinc-500">
                Biblioteca inteligente de conhecimento
              </p>
            </div>

          </div>

          <p className="text-sm text-zinc-600">
            {total} links encontrados
          </p>
        </div>

        <button
          onClick={onCreate}
          className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500"
        >
          <Plus size={16} />
          Novo link
        </button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">

        <div className="flex h-11 flex-1 items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4">
          <Search
            size={16}
            className="text-zinc-500"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Buscar links..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {FILTERS.map((item) => (
            <button
              key={item}
              onClick={() =>
                setFilter(item as any)
              }
              className={`h-11 rounded-2xl px-4 text-sm font-medium transition whitespace-nowrap
              ${
                filter === item
                  ? "bg-violet-600 text-white"
                  : "border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}