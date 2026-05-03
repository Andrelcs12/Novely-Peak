"use client";

import { motion } from "framer-motion";

type Props = {
  fullScreen?: boolean;
  text?: string;
};

export default function Loading({ fullScreen = false, text }: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "h-screen w-full bg-zinc-950" : "w-full py-10"
      }`}
    >
      <div className="relative flex items-center justify-center">

        {/* Ping */}
        <span className="absolute inline-flex h-12 w-12 rounded-full bg-indigo-500 opacity-20 animate-ping" />

        {/* Spinner */}
        <motion.div
          className="h-12 w-12 rounded-full border-4 border-zinc-700 border-t-indigo-500"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
        />
      </div>

      {text && (
        <p className="text-sm text-zinc-400">{text}</p>
      )}
    </div>
  );
}