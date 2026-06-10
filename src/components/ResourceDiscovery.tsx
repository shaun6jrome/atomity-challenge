"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useCloudResources } from "../hooks/useCloudResources";
import type { ResourceNode } from "../libs/api";
import CostTable from "./CostTable";
import ResourceChart from "./ResourceChart";

type Selection = {
  cluster?: ResourceNode;
  namespace?: ResourceNode;
};

const resourceTypes = ["CPU", "GPU", "RAM", "Storage", "Network"];

function LoadingState() {
  return (
    <div className="grid min-h-[34rem] place-items-center px-6 text-center">
      <div>
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)]" />
        <p className="mt-5 text-sm text-[var(--color-text-secondary)]">
          Mapping live cloud costs…
        </p>
      </div>
    </div>
  );
}

export default function ResourceDiscovery() {
  const { data, isLoading, isError, refetch } = useCloudResources();
  const [selection, setSelection] = useState<Selection>({});
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.18 });
  const reduceMotion = useReducedMotion();

  const level = selection.namespace
    ? "Pod"
    : selection.cluster
      ? "Namespace"
      : "Cluster";

  const nodes = useMemo(() => {
    if (selection.namespace) {
      return selection.namespace.children ?? [];
    }

    if (selection.cluster) {
      return selection.cluster.children ?? [];
    }

    return data ?? [];
  }, [data, selection]);

  const path = [
    selection.cluster?.name,
    selection.namespace?.name,
  ].filter(Boolean);

  function selectNode(node: ResourceNode) {
    if (!selection.cluster) {
      setSelection({ cluster: node });
      return;
    }

    if (!selection.namespace) {
      setSelection((current) => ({ ...current, namespace: node }));
    }
  }

  function goBack() {
    if (selection.namespace) {
      setSelection({ cluster: selection.cluster });
      return;
    }

    setSelection({});
  }

  return (
    <section
      id="cost-explorer"
      ref={sectionRef}
      aria-labelledby="cost-explorer-title"
      className="cost-section relative overflow-hidden"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 48 }}
        animate={isInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6"
      >
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            Live cost topology
          </p>
          <h2
            id="cost-explorer-title"
            className="mt-4 text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.055em]"
          >
            Zoom into the spend.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] sm:text-lg">
            Every bar is a doorway. Follow cost from a cluster into its
            namespaces and all the way down to individual pods.
          </p>
        </div>

        <div className="cost-panel">
          <div className="cost-panel-header flex items-center justify-between gap-5 border-b border-[var(--color-border)] px-5 py-5 sm:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em]">
                Last 30 days
              </span>
              <span className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-background)]">
                {path.length ? path.join(" / ") : "All infrastructure"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-[var(--color-text-secondary)]">Aggregated by</p>
                <p className="font-semibold">{level}</p>
              </div>
              {selection.cluster && (
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                >
                  Back
                </button>
              )}
            </div>
          </div>

          {isLoading && <LoadingState />}

          {isError && (
            <div className="grid min-h-[34rem] place-items-center px-6 text-center">
              <div>
                <p className="font-semibold">The live cost feed is unavailable.</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-5 rounded-full bg-[var(--color-accent)] px-5 py-2 text-sm font-bold text-[var(--color-background)]"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {!isLoading && !isError && nodes.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${level}-${path.join("-")}`}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.28 }}
              >
                <ResourceChart
                  nodes={nodes}
                  canDrillDown={level !== "Pod"}
                  onSelect={selectNode}
                />
                <CostTable data={nodes} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.45, duration: 0.55 }}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5"
          aria-label="Cost dimensions"
        >
          {resourceTypes.map((type, index) => (
            <motion.div
              key={type}
              whileHover={reduceMotion ? undefined : { y: -5 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-4 py-5 text-center"
            >
              <span className="mx-auto mb-3 grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-accent)] text-xs font-black text-[var(--color-background)]">
                {type.slice(0, 2)}
              </span>
              <span className="text-sm font-semibold">{type}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
