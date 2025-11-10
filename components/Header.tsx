"use client";

import Link from "next/link";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export default function Header() {
  const { status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = status === "authenticated";

  const handleThemeToggle = () => {
    if (!mounted) return;
    const isDark = (resolvedTheme ?? "light") === "dark";
    setTheme(isDark ? "light" : "dark");
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
    toast.success("ออกจากระบบเรียบร้อย", { position: "top-center" });
  };

  return (
    <nav className="fixed left-0 top-0 z-[9999] w-full bg-white/30 shadow shadow-gray-200 backdrop-blur-md transition-all duration-300 dark:bg-foreground dark:shadow-gray-800">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width={48} viewBox="0 0 48 48" id="rainy-weather">
            <circle cx="28.58" cy="15.85" r="7.75" fill="#fae380" />
            <path
              fill="#f4d967"
              d="M36.25,14.72a7.75,7.75,0,0,0-14.56,3.7,6.91,6.91,0,0,0,.08,1.11,7.65,7.65,0,0,1-.94-3.68,7.75,7.75,0,0,1,15.42-1.13Z"
            />
            <path
              fill="#b1d8fa"
              d="M28.39,20.83a7.61,7.61,0,0,0-15.22,0,7.61,7.61,0,0,0,0,15.22H28.39a7.61,7.61,0,0,0,0-15.22Z"
            />
            <path
              fill="#99c3dd"
              d="M28.16,19a7.61,7.61,0,0,0-13.55,4.76A7.61,7.61,0,0,0,7,31.33a7.81,7.81,0,0,0,.23,1.88,7.61,7.61,0,0,1,5.94-12.38,7.61,7.61,0,0,1,15-1.88Z"
            />
          </svg>
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            WeatherHub
          </Link>
        </div>

        <div className="flex items-center gap-3">
          
          <button
            onClick={handleThemeToggle}
            className="rounded-full bg-background p-2 shadow shadow-gray-400 hover:bg-gray-200 dark:bg-foreground dark:hover:bg-gray-700"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <span className="block h-5 w-5" />
            ) : resolvedTheme === "dark" ? (
              <FaSun size={20} color="#ffffff" />
            ) : (
              <FaMoon size={20} color="#000000" />
            )}
          </button>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="rounded-full bg-gray-600 px-4 py-2 text-white transition hover:bg-gray-700"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
