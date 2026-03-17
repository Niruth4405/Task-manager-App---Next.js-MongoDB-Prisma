// components/ui/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const user = session?.user;
  const initials =
    (user?.name || user?.email || "?")
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-14 items-center px-4 gap-4">
        <Link href="/dashboard" className="text-lg font-semibold">
          TaskMaster
        </Link>

        <nav className="hidden md:flex gap-4 text-sm">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/tasks" className="hover:underline">
            All Tasks
          </Link>
          <Link href="/settings" className="hover:underline">
            Settings
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {status === "unauthenticated" && (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}

          {status === "authenticated" && user && (
            <>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name || user.email || "User avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden md:flex flex-col">
                  <span className="text-xs font-medium leading-tight">
                    {user.name || user.email}
                  </span>
                  {user.email && (
                    <span className="text-[11px] text-muted-foreground leading-tight">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sign out
              </Button>
            </>
          )}

          {/* Theme toggle – render only after mount to avoid hydration mismatch */}
          {mounted && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
