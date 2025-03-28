// /types/next-auth.d.ts or /lib/next-auth.d.ts
import "next-auth";

// Augmenting the NextAuth types
declare module "next-auth" {
  interface User {
    id: string;
    image?: string;
    plan: string;
    email: string;
    authProviderId?: string;
  }

  interface Session {
    user: {
      id: string;
      image?: string;
      plan: string;
      email: string;
      authProviderId?: string;
    };
  }

  interface JWT {
    id?: string;
    plan: string;
    image?: string;
    email: string;
    authProviderId?: string;
  }
}
