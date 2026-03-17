// components/task-card.tsx
"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import type { Task } from "@/app/types/tasks";
import { updateTask, deleteTask } from "@/app/(app)/actions/task-actions";

interface Props {
  task: Task;
}

export function TaskCard({ task }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState(task.status);

  const prettyStatus =
    task.status === "IN_PROGRESS"
      ? "In progress"
      : task.status === "TODO"
      ? "To do"
      : "Done";

  function handleEdit(formData: FormData) {
    startTransition(async () => {
      await updateTask(task.id, {
        title,
        description: description || null,
        status,
      });
      setIsEditOpen(false);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTask(task.id);
    });
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base font-semibold">
            {task.title}
          </CardTitle>
          {task.description && (
            <p className="text-xs text-muted-foreground">
              {task.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize text-xs">
            {prettyStatus}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-2"
              >
                <Pencil className="h-3 w-3" />
                <span className="text-xs">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="flex items-center gap-2 text-destructive"
              >
                <Trash2 className="h-3 w-3" />
                <span className="text-xs">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent />

      {/* Edit dialog (opened from 3-dots menu) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit task</DialogTitle>
          </DialogHeader>

          <form action={handleEdit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor={`title-${task.id}`}>Title</Label>
              <Input
                id={`title-${task.id}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`description-${task.id}`}>Description</Label>
              <Input
                id={`description-${task.id}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(val) =>
                  setStatus(val as Task["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">To Do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
