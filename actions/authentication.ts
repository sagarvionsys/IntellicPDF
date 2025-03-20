import { signIn } from "next-auth/react";

const handleSignUp = () => {};

const handleOAuth = async (provider: string) => {
  await signIn(provider, { redirectTo: "/account" });
};

export { handleSignUp, handleOAuth };
