import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { validateUser } from "@/actions/validateUser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const user = await validateUser(credentials);
          if (!user) throw new Error("Invalid email or password");

          return {
            id: user._id,
            email: user.email,
            plan: user.plan,
            name: user.name,
          };
        } catch (error) {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.authProviderId = user.authProviderId || null;
        token.image = user.image || null;
        token.plan = user.plan as string;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.image as string;
        session.user.authProviderId = token.authProviderId as string;
        session.user.plan = token.plan as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const { email, image, id, name } = user;

          const existingUser = await prisma.user.upsert({
            where: { email },
            update: {
              image,
              authProviderId: id,
              authProvider: "google",
              name: name ?? email.split("@")[0],
            },
            create: {
              name: name ?? email.split("@")[0],
              email,
              image,
              authProviderId: id,
              authProvider: "google",
              plan: "BASIC",
            },
          });
          user.name = existingUser.name;
          user.plan = existingUser.plan;
          user.id = existingUser.id;
          user.authProviderId = existingUser.authProviderId ?? undefined;

          return true;
        } catch (error) {
          return false;
        }
      }
      return true;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },

  secret: process.env.AUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === "production",
};
