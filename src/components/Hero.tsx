"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="hero-glow absolute inset-0" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <div className="mb-6 inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-4 py-2 text-sm text-[var(--color-accent)]">
          Option A · Cost Explorer
        </div>

        <h1 className="text-5xl font-bold tracking-[-0.05em] md:text-7xl">
          Follow every dollar to its source.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-secondary)]">
          Move from cluster to namespace to pod in one continuous cost
          investigation. Scroll to open the live explorer.
        </p>

        <motion.a
          href="#cost-explorer"
          whileHover={{ y: 3 }}
          className="mt-12 inline-flex flex-col items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)]"
        >
          Explore costs
          <span aria-hidden="true" className="h-10 w-px bg-[var(--color-accent)]" />
        </motion.a>
      </motion.div>
    </section>
  );
}
