// app/types/goal.ts

export type GoalStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ABANDONED';
export type GoalPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type Goal = {
  id: string;
  title: string;
  description?: string | null;

  status: GoalStatus;
  priority: GoalPriority;
  progress: number; // 0–100

  dueDate?: string | null;
  completedAt?: string | null;

  category?: string | null;
  color?: string | null;
  icon?: string | null;

  archivedAt?: string | null;

  userId: string;
  createdAt: string;
  updatedAt: string;
};