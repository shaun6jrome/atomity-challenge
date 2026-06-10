"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-[60vh] items-end justify-center overflow-hidden pb-20 pt-32">
      <div className="hero-glow absolute inset-0" />

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
      >
        <div className="mb-6 inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-4 py-2 text-sm font-medium text-[var(--color-accent)]">
          Cloud Cost Intelligence
        </div>

        <h1 className="text-5xl font-bold tracking-[-0.06em] md:text-7xl">
          Understand where
          <br />
          infrastructure spend
          originates.
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-[var(--color-text-secondary)]">
          Drill from clusters to namespaces and individual pods
          to identify the resources driving cloud costs. Explore
          spend distribution, resource efficiency, and workload
          impact through an interactive cost topology.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="rounded-full border border-[var(--color-border)] px-4 py-2">
            Cluster → Namespace → Pod
          </span>

          <span className="rounded-full border border-[var(--color-border)] px-4 py-2">
            Cost Breakdown
          </span>

          <span className="rounded-full border border-[var(--color-border)] px-4 py-2">
            Resource Efficiency
          </span>
        </div>

        <motion.a
          href="#cost-explorer"
          whileHover={{
            y: 3,
          }}
          className="mt-14 inline-flex flex-col items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-text-secondary)]"
        >
          Explore Cost Topology

          <span
            aria-hidden="true"
            className="h-10 w-px bg-[var(--color-accent)]"
          />
        </motion.a>
      </motion.div>
    </section>
  );
}