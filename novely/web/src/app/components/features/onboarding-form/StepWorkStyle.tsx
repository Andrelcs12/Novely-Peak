import { Zap } from "lucide-react";
import { StepProps } from "@/app/types/onboarding";

export default function StepWorkStyle({ data, updateData }: StepProps) {

    const options = [
  { value: "MINIMAL", label: "Simples", hint: "Sem distrações, só o essencial" },
  { value: "BALANCED", label: "Equilibrado", hint: "Clareza com algumas métricas" },
  { value: "STRUCTURED", label: "Detalhado", hint: "Controle completo e dados" },
];

  return (
    <div className="space-y-8">
      <header>
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
          <Zap className="text-purple-700" size={22} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Como você prefere organizar?
        </h1>

        <p className="text-gray-500 mt-2">
          Define o nível de detalhe da interface.
        </p>
      </header>

      <div className="grid gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateData({ workStyle: opt.value as any })}
            className={`p-4 rounded-xl border text-left transition ${
              data.workStyle === opt.value
                ? "border-purple-700 bg-purple-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <p className="font-semibold text-gray-900">{opt.label}</p>
            <p className="text-xs text-gray-400 mt-1">{opt.hint}</p>
          </button>
        ))}
      </div>
    </div>
  );
}