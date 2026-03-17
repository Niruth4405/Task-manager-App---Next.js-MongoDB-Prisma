// components/auth/social-buttons.tsx
"use client";

import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export function SocialButtons() {
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={() => signIn("google")}
      >
        <FcGoogle className="h-4 w-4" />
        <span>Continue with Google</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={() => signIn("discord")}
      >
        <GitHubLogoIcon className="h-4 w-4" />
        <span>Continue with Github</span>
      </Button>
    </div>
  );
}
