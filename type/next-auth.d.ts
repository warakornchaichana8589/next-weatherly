import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user?: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    username: string;
    accessToken?: string;
  }

  interface JWT {
    accessToken?: string;
  }
}
