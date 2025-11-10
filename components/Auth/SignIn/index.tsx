"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import AuthGuard from "./AuthGuard"
import { toast } from "react-toastify";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { useAuthStore } from "@/store/authStore"

export default function SignIn() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [cooldown, setCooldown] = useState(false);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cooldown) return toast.warn("กรุณารอสักครู่ก่อนลองใหม่");
        setLoading(true);
        setCooldown(true);
        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
        })
        if (res?.error) {
            toast.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!", {
                position: "top-center",
            });
            setUsername("");
            setPassword("");
            setLoading(false);
            setTimeout(() => setCooldown(false), 3000);
            return;
        } else {
            const session = await getSession();
            const token = session?.accessToken;
            if (token) {
                useAuthStore.getState().setToken(token);
                console.log("✅ Token stored in Zustand:", token);
            }
            toast.success("เข้าสู่ระบบสำเร็จ!", { position: "top-center" });
            setLoading(false);
            router.push("/dashboard");
        }
    }
    return (
        <AuthGuard>
            <section className="w-full">
                <div className="container mx-auto min-h-screen flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center">
                        <div data-aos="zoom-in" className="flex flex-col items-center p-4 sm:p-8 ">
                            <div className="relative logo flex flex-col justify-center items-center">
                                <Image
                                    src="/images/logo.png"
                                    alt="Logo"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                                <span className="text-gray-900 font-bold dark:text-white text-xl -mt-6"><span className="text-5xl">W</span>eathweHub</span>
                            </div>
                            <div className="mt-4 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                                <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">Sign in</h2>
                            </div>
                            <div className="mt-4 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-sm h-full flex flex-col justify-between">
                                <form onSubmit={handleLogin} className="flex flex-col items-center">
                                    <div className="mb-[22px]">
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }

                                            className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div className="mb-[22px]">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div className="w-full flex">
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="cursor-pointer mx-auto"
                                        >
                                            <ShimmerButton background={theme === "dark" ? "#595959" : "#E3E3E3"} shimmerColor="#FFF59E">
                                                <div className="flex items-center w-full">
                                                    <span className="text-gray-900 text-sm">Login</span>
                                                </div>

                                            </ShimmerButton>
                                        </button>

                                    </div>
                                </form>
                                <span className="text-center mt-5 text-sm text-slate-600 dark:text-slate-50">
                                    username : test <br/>
                                    password : 1234 <br/>
                                    ใช้เพื่อทดสอบ
                                    </span>
                                
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </AuthGuard>

    )
};
