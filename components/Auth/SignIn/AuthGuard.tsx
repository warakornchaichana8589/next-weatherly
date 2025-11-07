"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader  from "@/components/Common/Loader"
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
            <div className="w-full h-full flex justify-center items-center min-h-screen bg-dark-white-text gap-2.5">
                <p className="text-gray-600 dark:text-gray-300">กำลังตรวจสอบ...</p> 
                <Loader />
            </div>
        );
    }

    return <>{children}</>;
}
