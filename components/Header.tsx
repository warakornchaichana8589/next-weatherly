"use client"

import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

import Link from "next/link";
export default function Header() {
    const { status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme();
    const [isAuth, setIsAuth] = useState(false)
    const handleLogout = async () => {
        await signOut({
            redirect: true,
            callbackUrl: "/"
        });
        toast.success("ออกจากระบบเรียบร้อยแล้ว", {
            position: "top-center",
        });
        setIsAuth(false)
    };
    useEffect(() => {
        setIsAuth(status === "authenticated" ? true : false)
        setMounted(true)
    }, [status])
    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) {
        return null
    }
    return (
        <>
            <nav className="fixed top-0 z-50 left-0 w-full shadow backdrop-blur-md shadow-gray-200 dark:shadow-gray-800 bg-white/30 dark:bg-foreground transition-all duration-300">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex justify-between h-16 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width={48} viewBox="0 0 48 48" id="rainy-weather">
                            <circle cx="28.58" cy="15.85" r="7.75" fill="#fae380"></circle>
                            <path fill="#f4d967" d="M36.25,14.72a7.75,7.75,0,0,0-14.56,3.7,6.91,6.91,0,0,0,.08,1.11,7.65,7.65,0,0,1-.94-3.68,7.75,7.75,0,0,1,15.42-1.13Z"></path>
                            <path fill="#b1d8fa" d="M28.39,20.83a7.61,7.61,0,0,0-15.22,0,7.61,7.61,0,0,0,0,15.22H28.39a7.61,7.61,0,0,0,0-15.22Z"></path>
                            <path fill="#99c3dd" d="M28.16,19a7.61,7.61,0,0,0-13.55,4.76A7.61,7.61,0,0,0,7,31.33a7.81,7.81,0,0,0,.23,1.88,7.61,7.61,0,0,1,5.94-12.38,7.61,7.61,0,0,1,15-1.88Z"></path>
                            <rect width="4.8" height="1.5" x="18.46" y="42.61" fill="#211915" transform="rotate(-65 20.861 43.357)"></rect>
                            <rect width="4.8" height="1.5" x="22.69" y="42.61" fill="#211915" transform="rotate(-65 25.095 43.362)"></rect>
                            <rect width="4.8" height="1.5" x="14.23" y="42.61" fill="#211915" transform="rotate(-65 16.635 43.357)"></rect>
                            <path fill="#211915" d="M37.07,15.85a8.49,8.49,0,0,0-16.35-3.19,8.35,8.35,0,0,0-8.26,7.64A8.35,8.35,0,0,0,13.17,37H28.39A8.35,8.35,0,0,0,34,22.41,8.48,8.48,0,0,0,37.07,15.85ZM35.26,28.62a6.88,6.88,0,0,1-6.87,6.87H13.17a6.87,6.87,0,1,1,0-13.74h.74V21a6.87,6.87,0,1,1,13.74,0v.74h.74A6.88,6.88,0,0,1,35.26,28.62ZM29.1,20.3a8.37,8.37,0,0,0-6.82-7.51,7,7,0,1,1,10.45,8.7A8.25,8.25,0,0,0,29.1,20.3Z"></path>
                            <rect width="1.48" height="3.37" x="25.11" y="2.15" fill="#211915" transform="rotate(-12.83 25.822 3.849)"></rect>
                            <rect width="3.37" height="1.48" x="38.92" y="12.38" fill="#211915" transform="rotate(-12.82 40.618 13.126)"></rect>
                            <rect width="3.37" height="1.48" x="33.46" y="4.68" fill="#211915" transform="rotate(-57.83 35.144 5.414)"></rect>
                            <rect width="1.48" height="3.37" x="38.28" y="20.73" fill="#211915" transform="rotate(-57.83 39.01 22.41)"></rect>
                            <rect width="1.48" height="3.37" x="17.41" y="7.6" fill="#211915" transform="rotate(-57.83 18.142 9.289)"></rect>
                            <path fill="#211915" d="M28.39,34.11V32.64c.16,0,4-.06,4-3.07h1.48C33.89,33.16,30.29,34.11,28.39,34.11Z"></path>
                        </svg>
                        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                            WeatherApp
                        </Link>
                    </div>
                    <div className="flex items-center justify-center gap-2.5">
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2 rounded-full shadow shadow-gray-400 bg-background dark:bg-foreground hover:bg-gray-200  dark:hover:bg-gray-700"
                        >
                            {theme === "dark" ? <FaSun size={20} color="#ffffff" /> : <FaMoon size={20} color="#000000" />}
                        </button>
                        {isAuth ?
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 cursor-pointer rounded-full bg-gray-600 text-white hover:bg-gray-700 transition"
                            >
                                Logout
                            </button>
                            : ""
                        }
                    </div>
                </div>
            </nav>
        </>
    )
};
