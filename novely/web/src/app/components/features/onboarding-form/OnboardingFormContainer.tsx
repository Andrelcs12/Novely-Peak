"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

import StepGoal from "./StepGoal";
import StepWorkStyle from "./StepWorkStyle";
import StepDiscipline from "./StepDiscipline";
import OnboardingProgress from "./OnboardingProgress";
import { OnboardingData } from "@/app/types/onboarding";

export default function OnboardingFormContainer() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    goal: "",
    workStyle: "",
    discipline: "",
  });

  const updateData = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const steps = [
    <StepGoal key="goal" data={data} updateData={updateData} />,
    <StepWorkStyle key="style" data={data} updateData={updateData} />,
    <StepDiscipline key="discipline" data={data} updateData={updateData} />,
  ];

  const canContinue = () => {
    return (
      (step === 0 && !!data.goal) ||
      (step === 1 && !!data.workStyle) ||
      (step === 2 && !!data.discipline)
    );
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // 🔥 ÚNICO ponto de persistência
      await api.patch("/user/onboarding", data);

      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col px-6 py-12">
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col">

        <OnboardingProgress step={step} total={steps.length} />

        <div className="flex-1 flex items-start pt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="w-full"
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-8 space-y-4">
          <button
            disabled={!canContinue() || loading}
            onClick={handleNext}
            className="w-full h-14 bg-purple-700 text-white font-semibold rounded-2xl
            hover:bg-purple-800 transition disabled:opacity-30
            flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : step === 2 ? (
              "Finalizar"
            ) : (
              "Continuar"
            )}
          </button>

          {step > 0 && !loading && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="w-full py-3 text-sm text-gray-500 hover:text-gray-800 transition"
            >
              Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}