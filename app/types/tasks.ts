// app/types/tasks.ts

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority?: "low" | "medium" | "high";
  createdAt: string | Date;
  dueDate?: string | Date | null;
}
