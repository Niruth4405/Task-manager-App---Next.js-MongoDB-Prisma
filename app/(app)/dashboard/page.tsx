// app/(app)/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TaskColumn } from "../../../components/ui/task-column";
import { AddTaskDialog } from "../../../components/ui/add-task-dialog";
import type { Task } from "@/app/types/tasks";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) redirect("/signin");

  const dbTasks = await prisma.task.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
  });

  // cast to your Task type (shape matches schema)
  const tasks: Task[] = dbTasks.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description ?? undefined,
    status: t.status as Task["status"],
    priority: (t.priority as any) ?? "medium",
    createdAt: t.createdAt,
    dueDate: t as any, // if you add dueDate later
  }));

  const todo = tasks.filter((t) => t.status === "TODO");
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
  const done = tasks.filter((t) => t.status === "DONE");

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <AddTaskDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn title="To Do" tasks={todo} />
        <TaskColumn title="In Progress" tasks={inProgress} />
        <TaskColumn title="Done" tasks={done} />
      </div>
    </section>
  );
}
