
import { CheckCircle2, Zap, Target } from "lucide-react";

type Props = {
  data: {
    title: string;
    description: string;
    image: string;
  };
};

const featuresByStep = [
  [
    "Crie listas claras de tarefas",
    "Defina prioridades automaticamente",
    "Evite sobrecarga mental",
  ],
  [
    "Reduza distrações digitais",
    "Aumente seu foco profundo",
    "Mantenha consistência diária",
  ],
  [
    "Acompanhe evolução real",
    "Construa hábitos sustentáveis",
    "Veja seu progresso crescer",
  ],
];

export default function OnboardingStep({
  data,
  features,
}: {
  data: {
    title: string;
    description: string;
    image: string;
  };
  features: string[];
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-12 w-full max-w-5xl">

      {/* IMAGE */}
      <div className="flex justify-center w-full md:w-1/2">
        <img
          src={data.image}
          alt={data.title}
          className="w-56 md:w-[26rem] object-contain"
        />
      </div>

      {/* TEXT */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-5 w-full md:w-1/2">

        <div className="space-y-2">
          <h1 className="text-2xl md:text-4xl font-bold text-purple-800 leading-tight">
            {data.title}
          </h1>

          <p className="text-gray-600 max-w-md">
            {data.description}
          </p>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
  {features.map((item, index) => (
    <div key={index} className="flex items-center gap-2">
      {index === 0 && <CheckCircle2 className="w-4 h-4 text-purple-700" />}
      {index === 1 && <Zap className="w-4 h-4 text-purple-700" />}
      {index === 2 && <Target className="w-4 h-4 text-purple-700" />}

      {item}
    </div>
  ))}
</div>
      </div>
    </div>
  );
}