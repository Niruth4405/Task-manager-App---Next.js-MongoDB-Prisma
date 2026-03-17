"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) throw new Error("User not found");

  const title = (formData.get("title") as string | null)?.trim();
  const description = (formData.get("description") as string | null)?.trim();
  const status = (formData.get("status") as string | null) ?? "TODO";

  if (!title) return { error: "Title is required" };

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      status: status as any,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTaskStatus(id: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  await prisma.task.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/dashboard");
}

export async function deleteTask(id: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
}

export async function updateTask(
  id: string,
  data: { title?: string; description?: string | null; status?: "TODO" | "IN_PROGRESS" | "DONE" }
) {
  const session = await auth();
  if (!session?.user?.email) throw new Error("Unauthorized");

  await prisma.task.update({
    where: { id },
    data,
  });

  revalidatePath("/dashboard");
}
