"use client";
import { ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";

export default function ThemeAwareToaster() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-center"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme === "dark" ? "dark" : "light"}
    />
  );
}
