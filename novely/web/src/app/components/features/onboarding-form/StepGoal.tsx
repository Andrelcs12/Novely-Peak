import { Target } from "lucide-react";
import { StepProps } from "@/app/types/onboarding";

export default function StepGoal({ data, updateData }: StepProps) {
  
    const options = [
  { value: "WORK", label: "Carreira", hint: "Entregas, prazos e produtividade" },
  { value: "STUDY", label: "Estudos", hint: "Aprendizado e retenção" },
  { value: "PROJECTS", label: "Projetos", hint: "Tirar ideias do papel" },
  { value: "LIFE", label: "Rotina", hint: "Hábitos e organização pessoal" },
];

  return (
    <div className="space-y-8">
      <header>
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
          <Target className="text-purple-700" size={22} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Qual seu foco principal?
        </h1>

        <p className="text-gray-500 mt-2">
          Isso define como o sistema organiza suas tarefas.
        </p>
      </header>

      <div className="grid gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateData({ goal: opt.value as any })}
            className={`p-4 rounded-xl border text-left transition ${
              data.goal === opt.value
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