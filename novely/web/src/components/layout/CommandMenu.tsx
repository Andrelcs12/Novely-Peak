"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckSquare, Target, Flame } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CommandMenu({ open, onClose }: Props) {
  const router = useRouter();

  const go = (path: string) => {
    router.push(path);
    onClose();
  };

  // ESC FECHA
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* overlay */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed right-6 top-16 w-72 z-50 
                       bg-zinc-900 border border-zinc-800 
                       rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* HEADER */}
            <div className="px-4 py-3 border-b border-zinc-800">
              <p className="text-xs text-zinc-400 uppercase tracking-wider">
                Ações rápidas
              </p>
            </div>

            {/* ACTIONS */}
            <div className="p-2 space-y-1">

              {/* TASK */}
              <button
                onClick={() => go("/tasks")}
                className="w-full flex cursor-pointer items-center gap-3 px-3 py-2 
                           rounded-xl hover:bg-zinc-800 transition"
              >
                <CheckSquare size={16} className="text-purple-400" />
                <div className="text-left">
                  <p className="text-sm text-white">Nova tarefa</p>
                  <p className="text-xs text-zinc-500">
                    Criar uma nova atividade
                  </p>
                </div>
              </button>

              {/* GOAL */}
              <button
                onClick={() => go("/goals")}
                className="w-full flex cursor-pointer items-center gap-3 px-3 py-2 
                           rounded-xl hover:bg-zinc-800 transition"
              >
                <Target size={16} className="text-orange-400" />
                <div className="text-left">
                  <p className="text-sm text-white">Nova meta</p>
                  <p className="text-xs text-zinc-500">
                    Definir um objetivo
                  </p>
                </div>
              </button>

              {/* HABIT */}
              <button
                onClick={() => go("/habits")}
                className="w-full flex cursor-pointer items-center gap-3 px-3 py-2 
                           rounded-xl hover:bg-zinc-800 transition"
              >
                <Flame size={16} className="text-pink-400" />
                <div className="text-left">
                  <p className="text-sm text-white">Novo hábito</p>
                  <p className="text-xs text-zinc-500">
                    Criar rotina diária
                  </p>
                </div>
              </button>

            </div>

            {/* FOOTER */}
            <div className="px-4 py-2 border-t border-zinc-800 hidden lg:block">
              <p className="text-[11px] text-zinc-500">
                ESC para fechar
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}