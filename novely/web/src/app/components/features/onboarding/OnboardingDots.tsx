
type Props = {
  step: number;
  total: number;
};

export default function OnboardingDots({ step, total }: Props) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all duration-300 ${
            i === step
              ? "w-6 bg-purple-800"
              : "w-2 bg-gray-300"
          }`}
        />
      ))}
    </div>
  );
}