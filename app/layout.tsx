
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/utils/themeProviders"
import SessionWrapper from "@/components/SessionWrapper";
import Header from "@/components/Header"
import Footer from "@/components/Footer"

import "react-toastify/dist/ReactToastify.css";
import ThemeAwareToaster from "@/components/ThemeAwareToaster";

export const metadata: Metadata = {
  title: "Weatherly",
  description: "Weatherly",
};

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body>
        <SessionWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <Header />
            {children}
            <ThemeAwareToaster />
            <Footer />
          </ThemeProvider>
        </SessionWrapper>


      </body>
    </html>
  );
}
