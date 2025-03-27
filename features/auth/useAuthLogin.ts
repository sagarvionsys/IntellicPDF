import { signIn } from "next-auth/react";

export const handleOAuth = async (provider: string) => {
  await signIn(provider, { redirectTo: "/account" });
};
