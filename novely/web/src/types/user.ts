export type UserGoal = "WORK" | "STUDY" | "PROJECTS" | "LIFE";

export type WorkStyle = "MINIMAL" | "BALANCED" | "STRUCTURED";

export type DisciplineLevel = "LOW" | "MEDIUM" | "HIGH";

export type User = {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  avatar?: string | null;

  onboardingIntroDone: boolean;
  onboardingDone: boolean;

  goal?: UserGoal | null;
  workStyle?: WorkStyle | null;
  discipline?: DisciplineLevel | null;

  focusLevel?: number | null;

  createdAt?: string;
  updatedAt?: string;
};