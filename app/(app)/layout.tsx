import type { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/ui/Header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-6 space-y-6">
        {children}
      </main>
    </div>
  );
}
