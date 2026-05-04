"use client";

import { Task } from "@/app/types/task";
import { X, CheckCircle2, Calendar, Timer, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  task: Task | null;
  onClose: () => void;
};

export default function TaskExpandedPanel({ task, onClose }: Props) {
  return (
    <AnimatePresence>
      {task && (
        <>

          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* PANEL */}
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-zinc-900 border-l border-zinc-800 p-6 space-y-6"
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 25,
            }}
          >

            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-400">
                Detalhes da tarefa
              </div>

              <button onClick={onClose}>
                <X size={18} className="text-zinc-400 hover:text-white" />
              </button>
            </div>

            {/* TITLE */}
            <div>
              <h2 className="text-xl font-semibold text-white">
                {task.title}
              </h2>

              <div className="text-xs text-zinc-500 mt-1">
                ID: {task.id}
              </div>
            </div>

            {/* STATUS */}
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 size={16} className="text-green-400" />
              <span className="text-zinc-300">{task.status}</span>
            </div>

            {/* META INFO CARD */}
            <div className="space-y-3 text-sm">

              <div className="flex justify-between text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Criada em
                </span>
                <span className="text-zinc-200">
                  {task.createdAt
                    ? new Date(task.createdAt).toLocaleString("pt-BR")
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Concluída em
                </span>
                <span className="text-zinc-200">
                  {task.completedAt
                    ? new Date(task.completedAt).toLocaleString("pt-BR")
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span className="flex items-center gap-1">
                  <Timer size={14} />
                  Duração
                </span>
                <span className="text-blue-400">
                  {task.completedAt && task.createdAt
                    ? Math.floor(
                        (new Date(task.completedAt).getTime() -
                          new Date(task.createdAt).getTime()) /
                          60000
                      ) + " min"
                    : "-"}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400">
                <span className="flex items-center gap-1">
                  <Tag size={14} />
                  Prioridade
                </span>
                <span className="text-purple-400">
                  {task.priority}
                </span>
              </div>

            </div>

            {/* EXTRA VISUAL BLOCK (opcional mas melhora UX) */}
            <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-800 text-xs text-zinc-400">
              Status atual da tarefa com atualização em tempo real do painel de execução.
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}