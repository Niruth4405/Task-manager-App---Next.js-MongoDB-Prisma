# Taskify – Task Management App

A modern task management app built with **Next.js 16** and **shadcn/ui**, focused on mastering real‑world CRUD patterns with a production‑ready stack. It features a responsive three‑column task board, a modal‑based “Add Task” flow, and full light/dark/system theming powered by CSS variables. [web:66][web:68][web:88]

## Features

- Three‑column task board layout (To Do, In Progress, Done) for clear workflow visualization.
- “Add Task” dialog using shadcn/ui `Dialog`, `Button`, `Input`, and `Label` components.
- Global light/dark/system theme support using CSS variables and a header theme toggle.
- App Router layout with shared header and main content area.
- Ready for integration with Prisma + MongoDB for persistent task CRUD and auth. [web:66][web:68][web:77]

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, CSS variables
- **UI Components:** shadcn/ui, lucide‑react icons
- **State & Data (planned):** Server Actions, Prisma ORM, MongoDB Atlas
- **Theming:** `next-themes` style setup with class‑based dark mode (or custom theme provider) [web:76][web:81][web:89]

## Project Structure (high‑level)

- `app/(app)/layout.tsx` – Root application layout with header and theme provider.
- `app/page.tsx` / `app/dashboard/page.tsx` – Main task board page.
- `components/header.tsx` – Top navigation bar with project title and theme toggle.
- `components/ui/add-task-dialog.tsx` – Modal form for creating new tasks.
- `app/actions/tasks.ts` – Server actions for creating tasks (Prisma integration planned).
- `app/globals.css` – Global styles, Tailwind layers, and design tokens for light/dark themes. [web:81][web:86][web:91]



