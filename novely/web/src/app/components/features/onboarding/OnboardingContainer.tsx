
"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import OnboardingStep from "./OnboardingStep";
import OnboardingDots from "./OnboardingDots";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const steps = [
  {
    title: "Defina suas tarefas do dia",
    description: "Organize o que precisa ser feito e tenha clareza total das suas prioridades.",
    image: "/onboarding/image1.png",
  },
  {
    title: "Elimine distrações",
    description: "Mantenha foco no que realmente importa e evite perder tempo com o celular.",
    image: "/onboarding/image2.png",
  },
  {
    title: "Evolua todos os dias",
    description: "Acompanhe seu progresso e construa consistência para alcançar seus objetivos.",
    image: "/onboarding/image3.png",
  },
];

export default function OnboardingContainer() {
  const [step, setStep] = useState(0);
  const router = useRouter();


  const next = () => {
  if (step < steps.length - 1) {
    setStep(step + 1);
  } else {
    router.push("/auth");
  }
};

  return (
  <div className="min-h-[100dvh] bg-white flex flex-col items-center px-6 md:px-16 py-10 relative overflow-hidden">
    {/* BACKGROUND BLURS */}
<div className="absolute -top-20 -left-30 w-60 h-60 md:w-96 md:h-96 bg-purple-800/30 rounded-full " />
<div className="absolute -top-10 left-10 md:left-40 w-40 h-40 md:w-72 md:h-72 bg-purple-800/20 rounded-full " />



    <div className="flex-1 flex items-center justify-center w-full">
  <AnimatePresence mode="wait">
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="w-full flex justify-center"
    >
      <OnboardingStep data={steps[step]} />
    </motion.div>
  </AnimatePresence>
</div>

    {/* FOOTER FIXO VISUAL */}
    <div className="w-full flex flex-col items-center gap-6">
      <OnboardingDots step={step} total={steps.length} />

      <motion.button
  whileTap={{ scale: 0.97 }}
  whileHover={{ scale: 1.02 }}
  onClick={next}
  className="w-full max-w-md cursor-pointer bg-purple-800 text-white py-3 rounded-xl font-medium"
>
  {step === steps.length - 1 ? "Começar" : "Próximo"}
</motion.button>
    </div>

  </div>
);
}
