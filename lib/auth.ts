import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";
import type { Role } from "@prisma/client";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type AuthorizedUser = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  role: Role;
  emailVerified: Date | null;
};

type JwtWithRole = {
  id: string;
  role: Role;
  emailVerified: Date | null;
};

type SessionUserWithRole = {
  id: string;
  role?: Role;
  emailVerified?: Date | null;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || "dev-secret-change-in-production-32-chars-min",
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await db.user.findFirst({
          where: { email, deletedAt: null },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as AuthorizedUser;
        token.id = authUser.id;
        token.role = authUser.role;
        token.emailVerified = authUser.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const jwtToken = token as JwtWithRole;
        session.user.id = jwtToken.id;
        const sessionUser = session.user as SessionUserWithRole;
        sessionUser.role = jwtToken.role;
        sessionUser.emailVerified = jwtToken.emailVerified;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        await db.systemLog.create({
          data: {
            userId: user.id,
            action: "USER_SIGN_IN",
            entity: "User",
            entityId: user.id,
          },
        });
      } catch (logErr) {
        console.error("Non-critical: systemLog on signIn failed:", logErr);
      }
    },
  },
});
