// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    darkMode: boolean;
  }

  interface Session {
    user: {
      darkMode: boolean;
    } & DefaultSession["user"];
  }
}
