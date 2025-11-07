import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "johndoe" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                // mock users (จำลองผู้ใช้)
                const mockUser = {
                    id: "1",
                    username: "gogo",
                    name: "John Doe",
                    email: "you@example.com",
                    password: "123456",
                };

                if (
                    credentials?.username === mockUser.username &&
                    credentials?.password === mockUser.password
                ) {

                    const { password, ...userWithoutPass } = mockUser;
                    return {
                        ...userWithoutPass,
                        accessToken: "mock-jwt-token-12345",
                    };
                }

                throw new Error("Invalid email or password");
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
           
            if (user) {
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
           
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

    secret: process.env.NEXTAUTH_SECRET || "dev-secret",
}
