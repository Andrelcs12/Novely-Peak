"use client";

import {
  ExternalLink,
  Sparkles,
  Star,
  Trash2,
  Pencil,
  Archive,
} from "lucide-react";

import { api } from "@/lib/api";

import { Link } from "../types/link";

type Props = {
  link: Link;
  onReload: () => void;
};

export default function LinkCard({
  link,
  onReload,
}: Props) {

  const handleDelete = async () => {
    const confirmDelete =
      confirm(
        "Deseja deletar este link?"
      );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/links/${link.id}`
      );

      onReload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFavorite =
    async () => {
      try {
        await api.patch(
          `/links/${link.id}`,
          {
            isFavorite:
              !link.isFavorite,
          }
        );

        onReload();
      } catch (err) {
        console.error(err);
      }
    };

  const handleArchive =
    async () => {
      try {
        await api.patch(
          `/links/${link.id}`,
          {
            isArchived: true,
          }
        );

        onReload();
      } catch (err) {
        console.error(err);
      }
    };

  return (
    <div className="group rounded-3xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-violet-500/30">

      <div className="flex items-start justify-between gap-4">

        <div className="flex gap-4">

          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            {link.favicon ? (
              <img
                src={link.favicon}
                className="h-6 w-6"
              />
            ) : (
              <div className="h-3 w-3 rounded-full bg-violet-500" />
            )}
          </div>

          <div>
            <h2 className="line-clamp-1 text-lg font-semibold text-white">
              {link.title || "Sem título"}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {link.domain}
            </p>
          </div>

        </div>

        <button
          onClick={handleFavorite}
        >
          <Star
            size={18}
            className={
              link.isFavorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-zinc-600"
            }
          />
        </button>

      </div>

      {link.description && (
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-zinc-400">
          {link.description}
        </p>
      )}

      {link.aiSummary && (
        <div className="mt-5 rounded-2xl border border-violet-500/10 bg-violet-500/5 p-4">

          <div className="mb-2 flex items-center gap-2">
            <Sparkles
              size={14}
              className="text-violet-400"
            />

            <span className="text-xs font-semibold uppercase tracking-wide text-violet-300">
              IA Summary
            </span>
          </div>

          <p className="line-clamp-3 text-sm leading-relaxed text-zinc-300">
            {link.aiSummary}
          </p>

        </div>
      )}

      {!!link.aiTags?.length && (
        <div className="mt-5 flex flex-wrap gap-2">
          {link.aiTags.map((tag) => (
            <div
              key={tag}
              className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-zinc-300"
            >
              {tag}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <button
            onClick={handleArchive}
            className="text-zinc-500 transition hover:text-white"
          >
            <Archive size={16} />
          </button>

          <button
            className="text-zinc-500 transition hover:text-white"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={handleDelete}
            className="text-zinc-500 transition hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>

        </div>

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-violet-400 transition hover:text-violet-300"
        >
          Abrir

          <ExternalLink size={14} />
        </a>

      </div>

    </div>
  );
}