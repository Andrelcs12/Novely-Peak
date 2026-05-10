"use client";

import {
  Brain,
  Bookmark,
  Eye,
  Link2,
} from "lucide-react";

import { Link } from "../types/link";

type Props = {
  links: Link[];
};

export default function LinksStats({
  links,
}: Props) {
  const favorites =
    links.filter(
      (link) => link.isFavorite
    ).length;

  const aiSummaries =
    links.filter(
      (link) => link.aiSummary
    ).length;

  const totalViews =
    links.reduce(
      (acc, link) =>
        acc + link.views,
      0
    );

  const cards = [
    {
      label: "Links",
      value: links.length,
      icon: Link2,
    },
    {
      label: "Favoritos",
      value: favorites,
      icon: Bookmark,
    },
    {
      label: "IA",
      value: aiSummaries,
      icon: Brain,
    },
    {
      label: "Views",
      value: totalViews,
      icon: Eye,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">
                  {card.label}
                </p>

                <h3 className="mt-2 text-3xl font-bold text-white">
                  {card.value}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
                <Icon
                  size={18}
                  className="text-violet-400"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}