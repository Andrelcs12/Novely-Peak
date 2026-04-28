"use client";

import { useState } from "react";
import OnboardingStep from "./OnboardingStep";
import OnboardingDots from "./OnboardingDots";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const steps = [
  {
    title: "Transforme intenção em execução diária",
    description:
      "Organize suas tarefas com clareza e elimine decisões desnecessárias. Foque apenas no que gera progresso real.",
    image: "/onboarding/image1.png",
  },
  {
    title: "Controle seu foco e elimine ruído",
    description:
      "Reduza distrações, simplifique sua rotina e entre em estado de execução profunda com consistência.",
    image: "/onboarding/image2.png",
  },
  {
    title: "Construa consistência mensurável",
    description:
      "Acompanhe sua evolução, mantenha disciplina e transforme pequenas ações em resultados concretos.",
    image: "/onboarding/image3.png",
  },
];

const featuresByStep = [
  [
    "Clareza total de tarefas",
    "Prioridade automática",
    "Zero sobrecarga mental",
  ],
  [
    "Redução de distrações",
    "Foco profundo guiado",
    "Execução consistente",
  ],
  [
    "Evolução mensurável",
    "Construção de hábitos",
    "Progresso contínuo",
  ],
];

export default function OnboardingContainer() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem("onboarding_intro_done", "true");
      router.push("/auth?mode=signup");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-white flex flex-col px-6 py-10 relative overflow-hidden">

      {/* BACKGROUND (PADRÃO PEAK) */}
      <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-violet-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[25rem] h-[25rem] bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-xl"
          >
            <OnboardingStep
              data={steps[step]}
              features={featuresByStep[step]}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 space-y-6">
        <OnboardingDots step={step} total={steps.length} />

        <button
          onClick={next}
          className="w-full h-14 rounded-2xl font-semibold 
          bg-gradient-to-r from-violet-600 to-indigo-600
          hover:from-violet-700 hover:to-indigo-700
          transition-all shadow-lg shadow-violet-900/30"
        >
          {step === steps.length - 1 ? "Iniciar sistema" : "Continuar"}
        </button>
      </div>
    </div>
  );
}