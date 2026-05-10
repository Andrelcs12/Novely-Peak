// ProfileTabs.tsx

"use client";

import {
  BarChart3,
  Flame,
  LayoutDashboard,
  Settings,
} from "lucide-react";

type Tab =
  | "overview"
  | "stats"
  | "streak"
  | "settings";

type Props = {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
};

const tabs = [
  {
    id: "overview",
    label: "Visão Geral",
    icon: LayoutDashboard,
  },

  {
    id: "stats",
    label: "Estatísticas",
    icon: BarChart3,
  },

  {
    id: "streak",
    label: "Consistência",
    icon: Flame,
  },

  {
    id: "settings",
    label: "Configurações",
    icon: Settings,
  },
] as const;

export default function ProfileTabs({
  activeTab,
  onChange,
}: Props) {
  return (
    <div className="relative">
      {/* FADE RIGHT */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-zinc-950 to-transparent md:hidden" />

      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-2 md:min-w-0 md:justify-between">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            const active =
              activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  onChange(
                    tab.id as Tab
                  )
                }
                className={`flex flex-shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 md:flex-1 ${
                  active
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon
                  size={16}
                  className="flex-shrink-0"
                />

                <span className="whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}