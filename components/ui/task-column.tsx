// components/task-column.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Task } from "@/app/types/tasks";
import { TaskCard } from "./task-card";

interface Props {
  title: string;
  tasks: Task[];
}

export function TaskColumn({ title, tasks }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm text-muted-foreground">
            {tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </CardContent>
    </Card>
  );
}
