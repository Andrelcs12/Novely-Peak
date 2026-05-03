"use client";

import { Menu, Bell, User2 } from "lucide-react";
import { User } from "@/app/types/user";

type Props = {
  user: User;
  onMenuClick: () => void;
  actions?: React.ReactNode;
};

export default function Header({
  user,
  onMenuClick,
  actions,
}: Props) {
  return (
    <header className="h-14 md:h-16 border-b border-purple-500/20 bg-zinc-950 flex items-center justify-between px-4 md:px-6">

      {/* LEFT */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-zinc-900 transition"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* ações da página (ex: botão criar) */}
        {actions}

        {/* NOTIFICATION */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 border border-purple-500/30 hover:bg-zinc-800 transition">
          <Bell size={16} className="text-zinc-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
        </button>

        {/* AVATAR */}
        <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-600 bg-zinc-800 flex items-center justify-center">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : user?.name ? (
            <span className="text-xs text-purple-400 font-semibold">
              {user.name[0]}
            </span>
          ) : (
            <User2 size={16} className="text-zinc-500" />
          )}
        </div>

      </div>
    </header>
  );
}