"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex items-center justify-center bg-transparent from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        
        <motion.div
          className="w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />
       
        <motion.div
          className="absolute w-20 h-20 rounded-full bg-cyan-400/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: "easeInOut",
          }}
        />
      
        <motion.p
          className="mt-8 text-cyan-200 text-lg font-semibold tracking-wide"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading
        </motion.p>
      </motion.div>
    </div>
  );
}
