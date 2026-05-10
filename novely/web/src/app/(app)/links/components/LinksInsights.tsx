"use client";

import { Brain } from "lucide-react";

import { Link } from "../types/link";

type Props = {
  links: Link[];
};

export default function LinksInsights({
  links,
}: Props) {
  const mostUsedType =
    links.reduce((acc, link) => {
      acc[link.type] =
        (acc[link.type] || 0) + 1;

      return acc;
    }, {} as Record<string, number>);

  const topType =
    Object.entries(mostUsedType).sort(
      (a, b) => b[1] - a[1]
    )[0];

  return (
    <div className="rounded-3xl border border-violet-500/10 bg-gradient-to-br from-violet-500/10 to-zinc-950 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
          <Brain
            size={20}
            className="text-violet-400"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">
            Insight IA
          </h2>

          <p className="max-w-2xl text-sm leading-relaxed text-zinc-300">
            Seu tipo de conteúdo mais
            salvo atualmente é{" "}
            <span className="font-semibold text-violet-300">
              {topType?.[0] ?? "ARTICLE"}
            </span>
            . Continue construindo sua
            base de conhecimento.
          </p>
        </div>
      </div>
    </div>
  );
}