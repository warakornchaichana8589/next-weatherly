"use client"
import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { GoAlert } from "react-icons/go";
import { useTheme } from "next-themes";
import { IoMdHome } from "react-icons/io";
import { FaLongArrowAltLeft } from "react-icons/fa";
export default function NotFound() {
  const { theme } = useTheme();
  return (
    <section className="py-4">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="flex flex-col w-96 justify-between gap-5 relative shadow-lg py-10 px-8 sm:rounded-3xl  bg-clip-padding bg-opacity-60 border border-gray-200 backdrop-sepia-0">
          <GoAlert className="h-20 w-20 text-amber-400 mx-auto" />
          <p className="text-gray-900 dark:text-white text-center">Oops! Looks like the page you’re looking for has drifted away with the clouds.
            Try going back to the dashboard or check your location settings.</p>

          <div className="flex flex-2 justify-between items-center">
            <Link
              href="/"
              className="text-l font-bold transition"
            >
              <ShimmerButton background={theme === "dark" ? "#595959" : "#E3E3E3"} shimmerColor="#FFF59E">
                <div className="flex items-center gap-2.5">
                  <FaLongArrowAltLeft className="text-gray-900" />
                  <span className="text-gray-900 text-sm">Go Back</span>
                </div>

              </ShimmerButton>
            </Link>
            <Link
              href="/"
              className="text-l font-bold transition"
            >
              <ShimmerButton background={theme === "dark" ? "#595959" : "#E3E3E3"} shimmerColor="#FFF59E">
                <div className="flex items-center gap-2.5">
                  <IoMdHome className="text-gray-900"/>
                  <span className="text-gray-900 text-sm">Return Home</span>
                </div>

              </ShimmerButton>
            </Link>


          </div>

        </div>

      </div>
    </section>
  )
};
