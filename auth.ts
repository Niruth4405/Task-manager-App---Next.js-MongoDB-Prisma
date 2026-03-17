import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

// Debug logs (remove later if desired)
console.log("GOOGLE_CLIENT_ID set?", !!process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_CLIENT_SECRET set?", !!process.env.GOOGLE_CLIENT_SECRET);
console.log("GITHUB_CLIENT_ID set?", !!process.env.GITHUB_CLIENT_ID);
console.log("GITHUB_CLIENT_SECRET set?", !!process.env.GITHUB_CLIENT_SECRET);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: true,

  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        mode: { label: "Mode", type: "text" }, // login | register
      },

      async authorize(credentials: any) {
        const { email, password, name, mode } = credentials ?? {};

        if (!email || !password) return null;

        // REGISTER
        if (mode === "register") {
          const existing = await prisma.user.findUnique({
            where: { email },
          });

          if (existing) return null;

          const passwordHash = await bcrypt.hash(password, 10);

          const user = await prisma.user.create({
            data: {
              email,
              name: name || null,
              passwordHash,
            },
          });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        }

        // LOGIN
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    /**
     * Fix OAuthAccountNotLinked
     * If OAuth login email already exists, link provider to that user
     */
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        if (!user.email) return true;

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
            update: {},
            create: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              id_token: account.id_token,
              scope: account.scope,
              token_type: account.token_type,
            },
          });

          user.id = existingUser.id;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id ?? token.id;
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      try {
        if (new URL(url).origin === baseUrl) return url;
      } catch {}

      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

