import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;
        const { email, password } = credentials || {};

        user = await prisma.user.findUnique({
          where: { userName: email as string },
          include: { relatedPartner: true },
        });

        if (!user) {
          throw new Error("Credenciales inválidas");
        }

        if (user.state === "no_active") {
          throw new Error("usuario no habilitado");
        }

        const verifiedPassword = await bcrypt.compare(
          password as string,
          user.password
        );

        if (!verifiedPassword) {
          throw new Error("Credenciales inválidas");
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.Partner.name,
          darkMode: user.darkMode,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 día por defecto
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.darkMode = user.darkMode;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.darkMode = token.darkMode as boolean;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
