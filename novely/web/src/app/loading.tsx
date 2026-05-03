"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="h-screen w-full bg-zinc-950 flex items-center justify-center">
      <div className="relative flex items-center justify-center">

        {/* Ping */}
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-indigo-500 opacity-20 animate-ping" />

        {/* Spinner */}
        <motion.div
          className="h-16 w-16 rounded-full border-4 border-zinc-700 border-t-indigo-500"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />

      </div>
    </div>
  );
}