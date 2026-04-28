import { Flame } from "lucide-react";
import { StepProps } from "@/app/types/onboarding";

export default function StepDiscipline({ data, updateData }: StepProps) {
  const options = [
  {
    label: "Baixo foco",
    value: "LOW",
    desc: "Dificuldade em manter atenção e consistência",
  },
  {
    label: "Foco instável",
    value: "MEDIUM",
    desc: "Alterna entre produtividade e distração",
  },
  {
    label: "Alta disciplina",
    value: "HIGH",
    desc: "Mantém foco e execução com consistência",
  },
];

  return (
    <div className="space-y-8">
      <header>
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
          <Flame className="text-purple-700" size={22} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Qual seu nível de disciplina?
        </h1>

        <p className="text-gray-500 mt-2">
          Ajusta o nível de cobrança do sistema.
        </p>
      </header>

      <div className="grid gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateData({ discipline: opt.value as any })}
            className={`p-4 rounded-xl border text-left transition ${
              data.discipline === opt.value
                ? "border-purple-700 bg-purple-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex justify-between">
              <p className="font-semibold text-gray-900">{opt.label}</p>
              {data.discipline === opt.value && (
                <div className="w-2 h-2 bg-purple-700 rounded-full" />
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}