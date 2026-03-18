// app/(app)/tasks/[id]/page.tsx
import type { Task } from "@/app/types/tasks";

const tasks: Task[] = [
  {
    id: "1",
    title: "Set up Prisma",
    status: "TODO",        // <-- uppercase
    createdAt: new Date(),
  },
];

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = tasks.find((t) => t.id === params.id);

  if (!task) {
    return (
      <p className="text-sm text-muted-foreground">
        Task not found.
      </p>
    );
  }

  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">{task.title}</h1>
      <p className="text-sm text-muted-foreground">
        Status: {task.status}
      </p>
    </section>
  );
}
