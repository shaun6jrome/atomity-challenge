"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f3d2e_0%,#080b12_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <div className="mb-6 inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
          Atomity Cloud Intelligence
        </div>

        <h1 className="text-5xl font-bold md:text-7xl">
          Understand where your cloud spend lives.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Discover hidden infrastructure costs, drill into workloads,
          and uncover optimization opportunities through a
          progressively revealed cost intelligence experience.
        </p>
      </motion.div>
    </section>
  );
}