// components/auth/signin-form.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialButtons } from "../ui/social-buttons";

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleCredentials(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/dashboard",
        email,
        password,
        name: isLogin ? undefined : name,
        mode: isLogin ? "login" : "register", // we’ll use this in authorize()
      });

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          setError(
            isLogin
              ? "Invalid email or password"
              : "Could not create account (email may already be in use)",
          );
        } else {
          setError(res.error);
        }
      } else if (res?.ok && res.url) {
        window.location.href = res.url;
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "discord") {
    setError("");
    setIsLoading(true);
    try {
      await signIn(provider, {
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md border border-border/80 shadow-sm bg-card">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-center text-2xl font-semibold tracking-tight">
          {isLogin ? "Sign in to Taskify" : "Create your account"}
        </CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Stay on top of your tasks in one place.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 pb-5">
        {error && (
          <p className="text-xs text-destructive border border-destructive/30 rounded px-3 py-2 bg-destructive/5">
            {error}
          </p>
        )}

        <SocialButtons onOAuthClick={handleOAuth} />

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Or continue with email
            </span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleCredentials}>
          {!isLogin && (
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-medium text-foreground/90"
              >
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                className="h-10 text-sm px-3 border-border focus-visible:ring-1 focus-visible:ring-primary"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-medium text-foreground/90"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-10 text-sm px-3 border-border focus-visible:ring-1 focus-visible:ring-primary"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-foreground/90"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="h-10 text-sm px-3 border-border focus-visible:ring-1 focus-visible:ring-primary"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full h-10 text-sm font-medium shadow-sm"
            disabled={isLoading}
          >
            {isLoading
              ? isLogin
                ? "Signing in..."
                : "Creating account..."
              : isLogin
              ? "Sign in"
              : "Sign up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t bg-muted/40 py-3">
        <p className="text-xs text-muted-foreground">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin((v) => !v)}
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
