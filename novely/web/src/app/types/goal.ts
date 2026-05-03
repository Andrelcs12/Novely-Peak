// =======================
// ENUMS
// =======================

export type GoalStatus =
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "ABANDONED";

export type GoalPriority = "LOW" | "MEDIUM" | "HIGH";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type GoalProgressMode = "MANUAL" | "TASKS" | "HYBRID";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

// =======================
// TASK
// =======================

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";


export type GoalTask = {
  id: string;

  title: string;
  description?: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  dueDate?: string | null;

  progress?: number;

  estimatedTime?: number; // minutos
  actualTime?: number; // minutos

  createdAt?: string;
  updatedAt?: string;
};

// =======================
// GOAL (BACKEND SHAPE)
// =======================

export type Goal = {
  id: string;

  title: string;
  description?: string | null;

  status: GoalStatus;
  priority: GoalPriority;

  progress: number;
  targetProgress?: number;

  score?: number;
  healthScore?: number;
  riskLevel?: RiskLevel;

  progressMode?: GoalProgressMode;

  dueDate?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;

  category?: string | null;
  color?: string | null;
  icon?: string | null;

  archivedAt?: string | null;

  userId: string;

  createdAt: string;
  updatedAt: string;

  tasks?: GoalTask[];
};

// =======================
// FORM STATE (🔥 UNIFICADO - USADO NO MODAL)
// =======================

export type GoalFormState = {
  title: string;
  description: string;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number;

  tasks: {
    id?: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
  }[];
};

// =======================
// FILTERS
// =======================

export type GoalStatusFilter =
  | "ALL"
  | "ACTIVE"
  | "COMPLETED"
  | "PAUSED";

export type GoalPriorityFilter =
  | "ALL"
  | "LOW"
  | "MEDIUM"
  | "HIGH";