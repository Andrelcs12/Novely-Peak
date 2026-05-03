"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  X,
  ArrowRight,
  ArrowLeft,
  Target,
  TrendingUp,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function StreakIntro({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "O que é o Streak?",
      icon: Flame,
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p>
            O streak representa sua consistência diária de execução.
          </p>

          <p className="text-xs text-zinc-400">
            Ele não mede esforço isolado, mas repetição contínua de comportamento.
          </p>

          <div className="flex items-start gap-2 text-xs text-zinc-400">
            <Target size={14} />
            <span>Consistência constrói resultados, não intensidade isolada.</span>
          </div>
        </div>
      ),
    },
    {
      title: "Como o streak funciona",
      icon: TrendingUp,
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p>A sua sequência depende da sua taxa de execução diária:</p>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-200">
              <Sparkles size={14} className="text-orange-400" />
              <span>≥ 70% → streak mantido</span>
            </div>

            <div className="flex items-center gap-2 text-zinc-400">
              <AlertTriangle size={14} />
              <span>40% – 69% → risco de quebra</span>
            </div>

            <div className="flex items-center gap-2 text-zinc-500">
              <X size={14} />
              <span>&lt; 40% → streak quebrado</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-800/50 text-xs text-zinc-400">
            O sistema valoriza consistência, não volume.
          </div>
        </div>
      ),
    },
    {
      title: "Por que isso importa",
      icon: Sparkles,
      content: (
        <div className="space-y-3 text-sm text-zinc-300">
          <p>
            O streak mede evolução comportamental real.
          </p>

          <div className="space-y-1 text-xs text-zinc-400">
            <div>• 3 dias → início de hábito</div>
            <div>• 7 dias → disciplina ativa</div>
            <div>• 30 dias → consistência consolidada</div>
          </div>

          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-200">
            O objetivo não é fazer mais tarefas, e sim manter execução contínua.
          </div>
        </div>
      ),
    },
  ];

  const current = steps[step];
  const Icon = current.icon;

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      onClose();
      setStep(0);
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-md rounded-2xl bg-zinc-950 border border-orange-500/20 p-6 overflow-hidden"
          >

            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-400">
                <Icon size={18} />
                <h2 className="font-semibold text-base">
                  {current.title}
                </h2>
              </div>

              <button onClick={onClose}>
                <X size={16} className="text-zinc-400 hover:text-white" />
              </button>
            </div>

            {/* PROGRESSO */}
            <div className="flex gap-1 mt-4">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition ${
                    i <= step ? "bg-orange-400" : "bg-zinc-800"
                  }`}
                />
              ))}
            </div>

            {/* HERO CENTRAL (IDENTIDADE DO STREAK) */}
            <div className="flex flex-col items-center justify-center text-center py-6 space-y-2">

              <div className="relative">
                <Flame
                  size={78}
                  className="text-orange-400 drop-shadow-[0_0_20px_rgba(251,146,60,0.35)]"
                />
              </div>

              <div className="text-orange-300 font-semibold text-sm">
                Streak System
              </div>

              <div className="text-xs text-zinc-500">
                Consistência diária de execução
              </div>
            </div>

            {/* CONTENT */}
            <div>{current.content}</div>

            {/* CTA */}
            <div className="flex gap-2 pt-4">
              {step > 0 && (
                <button
                  onClick={prev}
                  className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-sm flex items-center justify-center gap-1"
                >
                  <ArrowLeft size={14} />
                  Voltar
                </button>
              )}

              <button
                onClick={next}
                className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-sm font-medium flex items-center justify-center gap-1"
              >
                {step === steps.length - 1 ? "Entendi" : "Próximo"}
                <ArrowRight size={14} />
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}