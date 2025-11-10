"use client";
import LoadingAnimation from "@/components/Common/LoadingAnimation"
export default function Loading() {
  return (
    <div className="w-full h-full min-h-screen flex justify-center items-center">
      <LoadingAnimation />
    </div>
  );
}
