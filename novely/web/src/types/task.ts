export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface ChecklistItem {
  id: string;
  title: string;
  done: boolean;
}

export interface TaskLinkItem {
  title: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null; // ISO String retornada da API
  completedAt: string | null;
  
  estimatedTime: number | null;
  focusTime: number | null;
  
  checklist: ChecklistItem[]; // Convertido ou tipado como array no front
  links: TaskLinkItem[];       // Convertido ou tipado como array no front
  
  userId: string;
  goalId: string | null;
  
  createdAt: string;
  updatedAt: string;
}