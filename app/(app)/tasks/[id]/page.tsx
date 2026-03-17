import type { Task } from "../../../types/tasks";

interface TaskPageProps {
  params: { id: string };
}

const tasks: Task[] = [
  { id: "1", title: "Set up Prisma", status: "todo", createdAt: new Date() },
];

export default function TaskDetailPage({ params }: TaskPageProps) {
  const task = tasks.find((t) => t.id === params.id);

  if (!task) {
    return <p className="text-sm text-muted-foreground">Task not found.</p>;
  }

  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold">{task.title}</h1>
      <p className="text-sm text-muted-foreground capitalize">
        Status: {task.status.replace("-", " ")}
      </p>
    </section>
  );
}
