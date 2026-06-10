"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  delay?: number;
}

export default function AnimatedCard({
  children,
  delay = 0,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay,
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        backdrop-blur-xl
        shadow-[0_8px_40px_rgba(0,0,0,0.25)]
      "
    >
      {children}
    </motion.div>
  );
}