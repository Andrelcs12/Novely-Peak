"use client";

import { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: Props) {
  const isCustom = !!color;

  const bg = isCustom ? `${color}1A` : "#18181b";     // 10%
  const border = isCustom ? `${color}4D` : "#27272a"; // 30%
  const iconColor = isCustom ? color : "#a1a1aa";
  const valueColor = isCustom ? color : "#ffffff";

  return (
    <div
      className="p-4 rounded-xl transition-all duration-300"
      style={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
      }}
    >
      <div className="flex items-center gap-4">

        {/* ICON */}
        <div
          className="w-10 h-10 flex items-center justify-center rounded-lg"
          style={{
            color: iconColor,
            backgroundColor: bg,
          }}
        >
          <Icon size={20} />
        </div>

        {/* TEXT */}
        <div>
          <span className="text-sm font-medium text-zinc-400 block">
            {label}
          </span>

          <div
            className="text-2xl font-bold mt-1"
            style={{ color: valueColor }}
          >
            {value}
          </div>
        </div>

      </div>
    </div>
  );
}