
export type Task = {
  id: string;

  title: string;
  description?: string | null;

  status: "TODO" | "IN_PROGRESS" | "DONE";

  priority: "LOW" | "MEDIUM" | "HIGH";

  dueDate?: string | null;

  estimatedTime?: number | null;

  completedAt?: string | null;

  createdAt: string;
  updatedAt: string;
};

export type Plan = "FREE" | "PRO";