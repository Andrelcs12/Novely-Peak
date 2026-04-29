"use client";

import { Menu, Bell, User2 } from "lucide-react";
import { User } from "@/app/types/user";

type Props = {
  user: User;
  title?: string;
  onMenuClick: () => void;
  actions?: React.ReactNode; // 🔥 AQUI ESTÁ O PODER
};

export default function Header({
  user,
  title = "Painel",
  onMenuClick,
  actions,
}: Props) {
  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-4 md:px-6">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-zinc-900"
        >
          <Menu size={18} />
        </button>

        <span className="text-sm font-semibold text-white">
          {title}
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* 🔥 AÇÕES DINÂMICAS */}
        {actions}

        {/* NOTIFICAÇÃO */}
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition">
          <Bell size={16} className="text-zinc-400" />
        </button>

        {/* AVATAR */}
        <div className="w-9 h-9 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center">
          {user?.avatar ? (
            <User2 />
          ) : (
            <span className="text-xs text-purple-400 font-semibold">
              {user?.name?.[0] || "U"}
            </span>
          )}
        </div>

      </div>
    </header>
  );
}