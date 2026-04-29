
import { motion } from "framer-motion";
type Props = {
  step: number;
  total: number;
};

export default function OnboardingDots({ step, total }: Props) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i === step ? 24 : 8,
            backgroundColor: i === step ? "#6d28d9" : "#000000",
          }}
          transition={{ duration: 0.25 }}
          className="h-2 rounded-full"
        />
      ))}
    </div>
  );
}

