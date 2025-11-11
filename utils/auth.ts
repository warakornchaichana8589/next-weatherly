import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import jwt from "jsonwebtoken";
import type { Session } from "next-auth";

type MockUser = {
  id: "user1" | "user2";
  username: string;
  password: string;
  name: string;
  email: string;
};

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "mysecret";

const MOCK_USERS: MockUser[] = [
  {
    id: "user1",
    username: "gogo",
    password: "123456",
    name: "Warakorn",
    email: "warakorn@example.com",
  },
  {
    id: "user2",
    username: "test",
    password: "1234",
    name: "Mimi Cat",
    email: "mimi@example.com",
  },
];

const FALLBACK_USER = MOCK_USERS[0];

function issueMockAccessToken(payload: { id: string; username: string }) {
  return jwt.sign(payload, NEXTAUTH_SECRET, { expiresIn: "1h" });
  
}

function ensureTokenShape(token: Record<string, unknown>) {
  const matchedUser =
    MOCK_USERS.find((mock) => mock.id === token.id) ??
    MOCK_USERS.find((mock) => mock.username === token.username) ??
    FALLBACK_USER;

  token.id = matchedUser.id;
  token.username = matchedUser.username;

  if (!token.accessToken || typeof token.accessToken !== "string") {
    token.accessToken = issueMockAccessToken({
      id: matchedUser.id,
      username: matchedUser.username,
    });
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "johndoe" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const user = MOCK_USERS.find(
          (u) =>
            u.username === credentials?.username && u.password === credentials?.password
        );

        if (!user) {
          throw new Error("Invalid username or password");
        }

        const mockAccessToken = issueMockAccessToken({
          id: user.id,
          username: user.username,
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          accessToken: mockAccessToken,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.accessToken = user.accessToken;
      }
      ensureTokenShape(token);
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },

  secret: NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
