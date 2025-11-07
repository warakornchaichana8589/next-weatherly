"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/dashboard");
        }
    }, [status, router]);
    if (status === "loading" || status === "authenticated") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-600 dark:text-gray-300">กำลังตรวจสอบ...</p>
            </div>
        );
    }

    return <>{children}</>;
}
