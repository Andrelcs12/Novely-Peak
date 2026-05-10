"use client";

import { useMemo } from "react";

import {
  Calendar,
  CheckCircle2,
  Flame,
} from "lucide-react";

import { HeatmapDay } from "../../types/profile";

type Props = {
  heatmap: HeatmapDay[];
  completedTasks: number;
};

type WeekDay = {
  label: string;
  date: string;
  fullDate: string;
  count: number;
  isToday: boolean;
};

const WEEK_DAYS = [
  "Dom",
  "Seg",
  "Ter",
  "Qua",
  "Qui",
  "Sex",
  "Sáb",
];

export default function StreakHeatmap({
  heatmap,
  completedTasks,
}: Props) {
  const weekData = useMemo<
    WeekDay[]
  >(() => {
    const tasksMap = new Map<
      string,
      number
    >();

    // DADOS REAIS DO BACKEND
    heatmap.forEach((item) => {
      const normalized =
        new Date(item.date)
          .toISOString()
          .split("T")[0];

      tasksMap.set(
        normalized,
        item.count || 0
      );
    });

    const days: WeekDay[] = [];

    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const current =
        new Date();

      current.setHours(
        0,
        0,
        0,
        0
      );

      current.setDate(
        today.getDate() - i
      );

      const normalized =
        current
          .toISOString()
          .split("T")[0];

      const count =
        tasksMap.get(
          normalized
        ) || 0;

      days.push({
        label:
          WEEK_DAYS[
            current.getDay()
          ],

        date:
          current.toLocaleDateString(
            "pt-BR",
            {
              day: "2-digit",
              month: "2-digit",
            }
          ),

        fullDate:
          current.toLocaleDateString(
            "pt-BR",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }
          ),

        count,

        isToday: i === 0,
      });
    }

    return days;
  }, [heatmap]);

  const getCardStyles = (
    count: number
  ) => {
    if (count >= 8) {
      return "bg-violet-500/20 border-violet-400/40 hover:border-violet-300";
    }

    if (count >= 5) {
      return "bg-violet-500/15 border-violet-500/30 hover:border-violet-400";
    }

    if (count >= 3) {
      return "bg-violet-500/10 border-violet-500/20 hover:border-violet-500/50";
    }

    if (count >= 1) {
      return "bg-zinc-900 border-zinc-700 hover:border-violet-500/30";
    }

    return "bg-zinc-950 border-zinc-800 hover:border-zinc-700";
  };

  return (
    <div className="w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
            <Calendar size={18} className="text-violet-400" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-white md:text-lg">
              Consistência
            </h2>

            <p className="text-sm text-zinc-500">
              Últimos 7 dias de produtividade.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
            <Flame size={18} className="text-violet-400" />
          </div>

          <div>
            <p className="text-xs text-zinc-500">
              Tasks concluídas
            </p>

            <span className="text-xl font-bold text-white">
              {completedTasks}
            </span>
          </div>
        </div>
      </div>

      {/* WEEK GRID */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {weekData.map((day) => (
          <div
            key={day.fullDate}
            className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-1 ${getCardStyles(day.count)} ${day.isToday ? "ring-2 ring-violet-500/30" : ""}`}
          >
            {/* TOP */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  {day.label}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {day.date}
                </p>
              </div>

              {day.count > 0 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/10">
                  <CheckCircle2 size={14} className="text-violet-300" />
                </div>
              )}
            </div>

            {/* VALUE */}
            <div className="mt-6">
              <h3 className="text-3xl font-bold text-white">
                {day.count}
              </h3>

              <p className="mt-1 text-xs text-zinc-400">
                {day.count === 1
                  ? "tarefa concluída"
                  : "tarefas concluídas"}
              </p>
            </div>

            {/* DATE */}
            <div className="mt-5 border-t border-white/5 pt-3">
              <p className="text-[11px] text-zinc-500">
                {day.fullDate}
              </p>
            </div>

            {/* TODAY */}
            {day.isToday && (
              <div className="absolute right-3 top-3 rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[10px] font-medium text-violet-300">
                Hoje
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}