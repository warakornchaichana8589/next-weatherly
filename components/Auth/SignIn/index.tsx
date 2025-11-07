"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthGuard from "./AuthGuard"
import Loader from "@/components/Common/Loader";
import { toast } from "react-toastify";

export default function SignIn() {
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
                        <div className="flex flex-col items-center">
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">Sign in to your account</h2>
                            </div>
                            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
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
                                    <div className="mb-9">
                                        <button
                                            disabled={loading}
                                            type="submit"
                                            className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-dark-white-text px-5 py-3 text-base text-dark transition duration-300 ease-in-out hover:bg-primary/90 hover:text-gray-100"
                                        >
                                            Sign In {loading && <Loader />}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </AuthGuard>

    )
};
