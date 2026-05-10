"use client";

import { Link } from "../types/link";

import LinkCard from "./LinkCard";

type Props = {
  links: Link[];
  loading: boolean;

  onReload: () => void;
};

export default function LinksList({
  links,
  loading,
  onReload,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center text-zinc-500">
        Carregando links...
      </div>
    );
  }

  if (!links.length) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-10 text-center">
        <h3 className="text-lg font-semibold text-white">
          Nenhum link encontrado
        </h3>

        <p className="mt-2 text-sm text-zinc-500">
          Salve conteúdos para começar sua biblioteca.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {links.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          onReload={onReload}
        />
      ))}
    </div>
  );
}