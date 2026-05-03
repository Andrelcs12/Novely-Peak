"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  User as UserIcon,
  Crown,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  User2,
  UserPlus,
  Settings,
  LogOut,
} from "lucide-react";

import { useState } from "react";
import { User } from "@/app/types/user";
import { div } from "framer-motion/client";

type Props = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
};

const NAV_ITEMS = [
  { label: "Painel", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tarefas", href: "/tasks", icon: CheckSquare },
  { label: "Metas", href: "/goals", icon: Target },
  { label: "Perfil", href: "/profile", icon: UserIcon },
];

const SETTINGS_ITEMS = [
  { label: "Convidar Amigos", href: "/invite", icon: UserPlus },
  { label: "Configurações", href: "/settings", icon: Settings },
  { label: "Sair", href: "/auth/logout", icon: LogOut, alert: true },

]

export default function Sidebar({ user, isOpen, onClose }: Props) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const Content = (
    <div
      className={`
        h-full flex flex-col bg-zinc-950 border-r border-purple-500/20
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* TOP */}
<div
  className={`
    flex items-center px-3 py-3 border-b border-purple-500/20
    ${collapsed ? "justify-center" : "justify-between"}
  `}
>
  {!collapsed && (
    <div className="flex items-center gap-2">
      <img src="/logo.png" className="w-8" />
      <span className="text-sm font-bold text-purple-500">
        Novely Peak
      </span>
    </div>
  )}

  <button
    onClick={() => setCollapsed(!collapsed)}
    className="p-2 cursor-pointer rounded-lg flex items-center justify-center hover:bg-zinc-900 transition"
  >
    {collapsed ? (
      <PanelLeftOpen size={18} />
    ) : (
      <PanelLeftClose size={18} />
    )}
  </button>
</div>

      {/* NAV */}

      {
        collapsed ? (
          <div className="items-center flex justify-center py-2">
            <img src="/logo.png" className="w-8 rounded-3xl" />
          </div>
        )
        : (
          <>  </>
        )
      }
      <nav className="flex flex-col gap-2 px-2 py-2 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition relative
                ${
                  active
                    ? "bg-purple-600/20 text-purple-400"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <Icon size={18} />

              {/* LABEL */}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* TOOLTIP */}
              {collapsed && (
                <span className="absolute left-full ml-3 whitespace-nowrap bg-zinc-900 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
        


        <nav className="flex flex-col gap-2 px-2 py-2 flex-1 border-t border-purple-500/20">
  {SETTINGS_ITEMS.map((item) => {
    const Icon = item.icon;
    const active = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={`
          group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition relative

          ${
            item.alert
              ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
              : active
              ? "bg-purple-600/20 text-purple-400"
              : "text-zinc-300 hover:text-white hover:bg-zinc-900"
          }

          ${collapsed ? "justify-center" : ""}
        `}
      >
        {/* ICON */}
        <Icon
          size={18}
          className={item.alert ? "text-red-400" : ""}
        />

        {/* LABEL */}
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* TOOLTIP */}
        {collapsed && (
          <span className="absolute left-full ml-3 whitespace-nowrap bg-zinc-900 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none">
            {item.label}
          </span>
        )}
      </Link>
    );
  })}
</nav>

      

     {/* PRO (some quando colapsado) */}
{!collapsed && (
  <div className="px-3 mb-4">
    <div className="relative overflow-hidden p-4 rounded-xl border border-purple-500/20 bg-gradient-to-br from-zinc-900 to-zinc-950">

      {/* Glow sutil */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-600/20 blur-2xl rounded-full" />

      {/* HEADER */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
          <Crown size={16} />
        </div>

        <div>
          <div className="text-sm font-semibold text-white">
            Novely Pro
          </div>
          <div className="text-xs text-zinc-400">
            Desbloqueie insights avançados
          </div>
        </div>
      </div>

      {/* BENEFIT */}
      <p className="text-xs text-zinc-400 mt-3 relative z-10 leading-relaxed">
        Acompanhe sua performance, receba sugestões inteligentes e evolua sua produtividade.
      </p>

      {/* CTA */}
      <button className="mt-4 w-full py-2 rounded-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200 shadow-md shadow-purple-600/20 hover:shadow-purple-600/40">
        Fazer upgrade
      </button>
    </div>
  </div>
)}

      {/* PROFILE */}
<div className="px-2 pb-4">
  <div
    className={`
      flex items-center gap-3 p-2 rounded-xl bg-zinc-900/60 border border-zinc-800
      ${collapsed ? "justify-center" : ""}
    `}
  >
     { /*
    <div className="w-9 h-9 rounded-full overflow-hidden border border-purple-600 bg-zinc-800 flex items-center justify-center">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      ) : (

      } 
       
      )}
    </div> */}

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

    {!collapsed && (
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">
          {user.name || "Usuário"}
        </span>
        <span className="text-xs text-purple-400 truncate max-w-[120px]">
          @{user.email || "username"}
        </span>
      </div>
    )}
  </div>
</div>
    
    </div>
  );

  return (
    <>
      {/* DESKTOP */}
      <aside className="hidden md:block">{Content}</aside>

      {/* MOBILE */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.div
              className="fixed left-0 top-0 h-full z-50 md:hidden"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
            >
              {Content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}