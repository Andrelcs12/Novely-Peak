"use client";

import {
  X,
  Target,
  CheckSquare,
  TrendingUp,
  ShieldAlert,
  BarChart3,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function GoalsHelpModal({ open, onClose }: Props) {
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

          {/* MODAL */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <div className="w-full max-w-lg bg-zinc-900 border border-purple-500/20 rounded-2xl p-6 space-y-5">

              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Sistema de Metas
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Direção, execução e performance
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-zinc-800"
                >
                  <X size={16} />
                </button>
              </div>

              {/* INTRO */}
              <p className="text-sm text-zinc-400 leading-relaxed">
                Metas representam resultados estratégicos.  
                Elas organizam tarefas e também medem performance, não apenas conclusão.
              </p>

              {/* DIFERENÇA BASE */}
              <div className="space-y-3">

                <div className="flex gap-3">
                  <CheckSquare size={16} className="text-purple-400 mt-1" />
                  <div>
                    <p className="text-sm text-white font-medium">
                      Tasks (Execução)
                    </p>
                    <p className="text-xs text-zinc-500">
                      Ações pontuais que geram progresso operacional.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Target size={16} className="text-green-400 mt-1" />
                  <div>
                    <p className="text-sm text-white font-medium">
                      Goals (Direção)
                    </p>
                    <p className="text-xs text-zinc-500">
                      Objetivos de alto nível que agrupam tarefas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <TrendingUp size={16} className="text-purple-400 mt-1" />
                  <div>
                    <p className="text-sm text-white font-medium">
                      Progresso
                    </p>
                    <p className="text-xs text-zinc-500">
                      Pode ser manual, automático (tasks) ou híbrido.
                    </p>
                  </div>
                </div>

              </div>

              {/* NOVO MODELO INTELIGENTE */}
              <div className="space-y-3 pt-2 border-t border-zinc-800">

                <div className="flex gap-3">
                  <BarChart3 size={16} className="text-purple-400 mt-1" />
                  <div>
                    <p className="text-sm text-white font-medium">
                      Score de Performance
                    </p>
                    <p className="text-xs text-zinc-500">
                      Mede eficiência geral da meta (execução + consistência).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Brain size={16} className="text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm text-white font-medium">
                      Health Score
                    </p>
                    <p className="text-xs text-zinc-500">
                      Indica qualidade da execução e ritmo sustentável.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <ShieldAlert size={16} className="text-red-400 mt-1" />
                  <div>
                    <p className="text-sm text-white font-medium">
                      Risk Level
                    </p>
                    <p className="text-xs text-zinc-500">
                      Detecta risco de atraso ou abandono da meta.
                    </p>
                  </div>
                </div>

              </div>

              {/* INSIGHT FINAL */}
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                Metas evoluíram de listas simples para um sistema de performance e direção estratégica.
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}