"use client"
 
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
   useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-in-out",
    });
  }, []);
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}