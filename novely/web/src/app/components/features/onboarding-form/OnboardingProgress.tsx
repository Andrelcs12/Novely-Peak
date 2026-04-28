type Props = {
  step: number;
  total: number;
};

export default function OnboardingProgress({ step, total }: Props) {
  return (
    <div className="flex gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            i <= step
              ? "bg-purple-700"
              : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}