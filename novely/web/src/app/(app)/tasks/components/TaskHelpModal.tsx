"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Target,
  Clock,
  Calendar,
  Zap,
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function TasksHelpModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* OVERLAY */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* MODAL WRAPPER */}
          <motion.div
            className="
              fixed inset-0 z-70 
              flex items-end md:items-center 
              justify-center 
              p-0 m-4 md:m-0 md:p-4
            "
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <div
              className="
                w-full md:max-w-md
                h-[90vh] md:h-auto
                bg-zinc-900 
                border-t md:border border-purple-600/40 
                rounded-t-2xl md:rounded-2xl
                p-5 md:p-6 
                space-y-5 
                shadow-[0_0_30px_rgba(139,92,246,0.1)]
                overflow-y-auto
              "
            >
              {/* DRAG INDICATOR (mobile) */}
              <div className="w-10 h-1.5 bg-purple-600 rounded-full mx-auto mb-2 md:hidden" />

              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-base md:text-lg font-semibold text-white">
                    Como usar tarefas
                  </h2>
                  <p className="text-[11px] md:text-xs text-zinc-500">
                    Clareza gera execução
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 cursor-pointer rounded-full hover:bg-zinc-800 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* EXPLICAÇÃO */}
              <p className="text-sm text-zinc-400 leading-relaxed">
                Tarefas transformam intenção em ação. Quanto mais clara,
                maior a chance de execução.
              </p>

              {/* REGRAS */}
              <div className="space-y-4">

                <div className="flex gap-3 items-start">
                  <Target size={16} className="text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-200 font-medium">
                      Seja específico
                    </p>
                    <p className="text-xs text-zinc-500">
                      Evite "estudar". Use: "Estudar matemática por 30min"
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Clock size={16} className="text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-200 font-medium">
                      Defina tempo
                    </p>
                    <p className="text-xs text-zinc-500">
                      Definir o tempo reduz resistência mental para começar
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Calendar size={16} className="text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-zinc-200 font-medium">
                      Defina prazo
                    </p>
                    <p className="text-xs text-zinc-500">
                      Sem prazo = sem necessidade real
                    </p>
                  </div>
                </div>

              </div>

              {/* ALERTA */}
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-xs md:text-sm text-red-400">
                Tarefas vagas geram procrastinação
              </div>

              {/* INSIGHT FINAL */}
              <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-lg flex items-center gap-2">
                <Zap size={14} className="text-purple-400" />
                <span className="text-xs md:text-sm text-purple-300">
                  Clareza → Execução → Resultado
                </span>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}