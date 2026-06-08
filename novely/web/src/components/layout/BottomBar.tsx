"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  User,
  Plus,
} from "lucide-react";

type Props = {
  onOpenCommand: () => void;
};

const NAV = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Painel" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/goals", icon: Target, label: "Metas" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export default function BottomBar({ onOpenCommand }: Props) {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+8px)]">
      <div className="relative h-16 rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-xl shadow-xl flex items-center justify-around">

        {/* NAV */}
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-2 select-none"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center px-2 py-1 rounded-lg transition ${
                  active ? "bg-purple-500/10" : ""
                }`}
              >
                <Icon
                  size={18}
                  className={
                    active
                      ? "text-purple-400"
                      : "text-zinc-400"
                  }
                />

                <span
                  className={`text-[11px] mt-[2px] ${
                    active ? "text-purple-400" : "text-zinc-500"
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}

        {/* FAB */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <motion.button
            onClick={onOpenCommand}
            whileTap={{ scale: 0.9 }}
            className="relative w-12 h-12 rounded-full flex items-center justify-center
                       bg-purple-600 shadow-xl shadow-purple-600/30
                       border border-purple-400/20"
          >
            {/* glow sutil */}
            <div className="absolute inset-0 rounded-full bg-purple-500 blur-xl opacity-20" />

            <Plus size={20} className="text-white z-10" />
          </motion.button>
        </div>

      </div>
    </div>
  );
}