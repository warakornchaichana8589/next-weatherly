"use client"
import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
export default function Dashboard() {
    const handleLogout = async () => {
        await signOut({ 
            redirect: true,
            callbackUrl: "/"
         });
        toast.success("ออกจากระบบเรียบร้อยแล้ว", {
            position: "top-center",
        });
    };
    useEffect(() => {
        AOS.init({
            duration: 1200,
        });
    }, []);
    return (
        <section className="min-h-screen bg-dark-white-text pt-20" data-aos="fade-up">
            <div className="container p-5 mx-auto">
                <h1 className="text-center text-gray-900 dark:text-white">Dashboard page</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                >
                    ออกจากระบบ
                </button>
            </div>
        </section>
    )
};
