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
                    password: "123456", // สมมติว่าเป็น password จริง
                };

                if (
                    credentials?.username === mockUser.username &&
                    credentials?.password === mockUser.password
                ) {
                    // ลบ password ออกก่อนส่งกลับ
                    const { password, ...userWithoutPass } = mockUser;
                    return userWithoutPass;
                }

                // ถ้า login ผิด
                throw new Error("Invalid email or password");
            },
        }),
    ],

    pages: {
        signIn: "/auth/signin", // หน้า login ที่คุณสร้างเอง
    },

    session: {
        strategy: "jwt", // ใช้ JWT แทน session server
    },

    secret: process.env.NEXTAUTH_SECRET || "dev-secret",
}
