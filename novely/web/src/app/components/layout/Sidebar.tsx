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
} from "lucide-react";

import { User } from "@/app/types/user";
import {
  DisciplineLevel,
  UserGoal,
  WorkStyle,
} from "@/app/types/onboarding";

type Props = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
};

// =======================
// NAV CONFIG
// =======================
const NAV_ITEMS = [
  { label: "Painel", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tarefas", href: "/tasks", icon: CheckSquare },
  { label: "Metas", href: "/goals", icon: Target },
  { label: "Perfil", href: "/profile", icon: UserIcon },
];

// =======================
// FORMAT
// =======================
const goalMap = {
  WORK: "Trabalho",
  STUDY: "Estudos",
  PROJECTS: "Projetos",
  LIFE: "Vida pessoal",
};

const styleMap = {
  MINIMAL: "Minimalista",
  BALANCED: "Equilibrado",
  STRUCTURED: "Estruturado",
};

const disciplineMap = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

// =======================
// COMPONENT
// =======================
export default function Sidebar({ user, isOpen, onClose }: Props) {
  const pathname = usePathname();

  const Content = (
    <div className="h-full flex flex-col p-4 bg-zinc-950 border-r border-zinc-800 w-64">

      {/* MOBILE CLOSE */}
      <div className="flex justify-end md:hidden mb-2">
        <button onClick={onClose}>
          <X size={18} className="text-zinc-400" />
        </button>
      </div>

      {/* PERFIL */}
      <div className="mb-6 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
        <div className="font-semibold text-white text-sm">
          {user.name || "Usuário"}
        </div>

        <div className="text-xs text-purple-400">
          @{user.username || "username"}
        </div>

        <div className="text-[11px] mt-3 text-zinc-400">
          <span className="text-purple-400">Objetivo:</span>{" "}
          {user.goal ? goalMap[user.goal] : "—"} •{" "}
          <span className="text-purple-400">Estilo:</span>{" "}
          {user.workStyle ? styleMap[user.workStyle] : "—"} •{" "}
          <span className="text-purple-400">Disciplina:</span>{" "}
          {user.discipline ? disciplineMap[user.discipline] : "—"}
        </div>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition
                ${
                  active
                    ? "bg-purple-600/20 text-purple-400"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                }
              `}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* PRO */}
      <div className="mt-auto p-4 rounded-xl border border-purple-500/20 bg-zinc-900/40">
        <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
          <Crown size={16} />
          Novely Pro
        </div>

        <p className="text-xs text-zinc-400 mt-1">
          Insights avançados de produtividade.
        </p>

        <button className="mt-3 w-full bg-purple-600 hover:bg-purple-700 transition text-white text-sm py-2 rounded-xl font-medium">
          Fazer upgrade
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:block">{Content}</div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* SIDEBAR */}
            <motion.div
              className="fixed left-0 top-0 h-full z-50 md:hidden"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            >
              {Content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}