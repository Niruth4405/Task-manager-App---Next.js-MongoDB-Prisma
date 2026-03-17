import type { Task } from "../../../app/types/tasks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const tasks: Task[] = [
  { id: "1", title: "Set up Prisma", status: "todo", createdAt: new Date() },
  { id: "2", title: "Create Task model", status: "in-progress", createdAt: new Date() },
  { id: "3", title: "Build Add Task form", status: "done", createdAt: new Date() },
];

export default function TasksPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">All Tasks</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between border-b last:border-b-0 py-2"
            >
              <span>{task.title}</span>
              <span className="text-xs capitalize text-muted-foreground">
                {task.status.replace("-", " ")}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
