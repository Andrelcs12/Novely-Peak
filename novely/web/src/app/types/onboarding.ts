export type UserGoal = "WORK" | "STUDY" | "PROJECTS" | "LIFE";
export type WorkStyle = "MINIMAL" | "BALANCED" | "STRUCTURED";
export type DisciplineLevel = "LOW" | "MEDIUM" | "HIGH";

export interface OnboardingData {
  goal: UserGoal | "";
  workStyle: WorkStyle | "";
  discipline: DisciplineLevel | "";
}

export interface StepProps {
  data: OnboardingData;
  updateData: (fields: Partial<OnboardingData>) => void;
}