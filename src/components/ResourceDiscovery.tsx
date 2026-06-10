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
    <div className="p-8">
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]"
          />
        ))}
      </div>

      <div className="h-72 animate-pulse rounded-2xl bg-[var(--color-muted)]" />
    </div>
  );
}

export default function ResourceDiscovery() {
  const { data, isLoading, isError, refetch } = useCloudResources();

  const [selection, setSelection] = useState<Selection>({});

  const sectionRef = useRef<HTMLElement>(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.18,
  });

  const reduceMotion = useReducedMotion();

  const level = selection.namespace
    ? "Pod"
    : selection.cluster
      ? "Namespace"
      : "Cluster";

  const nodes = useMemo(() => {
  const source = selection.namespace
    ? selection.namespace.children ?? []
    : selection.cluster
      ? selection.cluster.children ?? []
      : data ?? [];

  return [...source].sort(
    (a, b) => b.metrics.total - a.metrics.total
  );
}, [data, selection]);

  const totalSpend = nodes.reduce(
    (sum, node) => sum + node.metrics.total,
    0
  );

  const highestCost =
    nodes.length > 0
      ? nodes.reduce((prev, current) =>
          current.metrics.total > prev.metrics.total
            ? current
            : prev
        )
      : null;

  const averageEfficiency =
    nodes.length > 0
      ? Math.round(
          nodes.reduce(
            (sum, node) =>
              sum + node.metrics.efficiency,
            0
          ) / nodes.length
        )
      : 0;

  function selectNode(node: ResourceNode) {
    if (!selection.cluster) {
      setSelection({
        cluster: node,
      });
      return;
    }

    if (!selection.namespace) {
      setSelection({
        cluster: selection.cluster,
        namespace: node,
      });
    }
  }

  function goBack() {
    if (selection.namespace) {
      setSelection({
        cluster: selection.cluster,
      });
      return;
    }

    setSelection({});
  }

  function goToRoot() {
    setSelection({});
  }

  function goToCluster() {
    if (!selection.cluster) return;

    setSelection({
      cluster: selection.cluster,
    });
  }

  return (
    <section
      id="cost-explorer"
      ref={sectionRef}
      aria-labelledby="cost-explorer-title"
      className="cost-section relative overflow-hidden"
    >
      <motion.div
        initial={
          reduceMotion
            ? false
            : { opacity: 0, y: 48 }
        }
        animate={
          isInView
            ? { opacity: 1, y: 0 }
            : undefined
        }
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
        }}
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
            Every bar is a doorway. Follow cost
            from a cluster into its namespaces
            and all the way down to individual
            pods.
          </p>
        </div>

        {!isLoading && !isError && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                Monthly Spend
              </p>
              <p className="mt-2 text-3xl font-bold">
                $
                {totalSpend.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                Resources
              </p>
              <p className="mt-2 text-3xl font-bold">
                {nodes.length}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                Highest Cost
              </p>
              <p className="mt-2 text-xl font-bold">
                {highestCost?.name ??
                  "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-secondary)]">
                Efficiency
              </p>
              <p className="mt-2 text-3xl font-bold">
                {averageEfficiency}%
              </p>
            </div>
          </div>
        )}

        <div className="cost-panel">
          <div className="cost-panel-header flex items-center justify-between gap-5 border-b border-[var(--color-border)] px-5 py-5 sm:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em]">
                Last 30 Days
              </span>

              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]">
                <button
                  onClick={goToRoot}
                  className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-[var(--color-background)]"
                >
                  All Infrastructure
                </button>

                {selection.cluster && (
                  <>
                    <span>/</span>

                    <button
                      onClick={goToCluster}
                      className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-[var(--color-background)]"
                    >
                      {selection.cluster.name}
                    </button>
                  </>
                )}

                {selection.namespace && (
                  <>
                    <span>/</span>

                    <span className="rounded-full bg-[var(--color-accent)] px-4 py-2 text-[var(--color-background)]">
                      {
                        selection.namespace
                          .name
                      }
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Aggregated by
                </p>

                <p className="font-semibold">
                  {level}
                </p>
              </div>

              {selection.cluster && (
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--color-accent)]"
                >
                  Back
                </button>
              )}
            </div>
          </div>

          {isLoading && <LoadingState />}

          {isError && (
            <div className="grid min-h-[34rem] place-items-center p-8 text-center">
              <div>
                <h3 className="text-xl font-bold">
                  Unable to load cloud
                  cost data
                </h3>

                <p className="mt-3 text-[var(--color-text-secondary)]">
                  The live feed is
                  currently unavailable.
                </p>

                <button
                  onClick={() => refetch()}
                  className="mt-6 rounded-full bg-[var(--color-accent)] px-6 py-3 font-bold text-[var(--color-background)]"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!isLoading &&
            !isError &&
            nodes.length > 0 && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${level}-${selection.cluster?.id}-${selection.namespace?.id}`}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          x: 30,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -30,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  <ResourceChart
                    nodes={nodes}
                    canDrillDown={
                      level !== "Pod"
                    }
                    onSelect={selectNode}
                  />

                  <CostTable
                    data={nodes}
                  />
                </motion.div>
              </AnimatePresence>
            )}
        </div>

        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 20 }
          }
          animate={
            isInView
              ? { opacity: 1, y: 0 }
              : undefined
          }
          transition={{
            delay: 0.45,
            duration: 0.55,
          }}
          className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5"
        >
          {resourceTypes.map(
            (type, index) => (
              <motion.div
                key={type}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -5 }
                }
                transition={{
                  delay: index * 0.04,
                }}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-4 py-5 text-center"
              >
                <span className="mx-auto mb-3 grid h-9 w-9 place-items-center rounded-xl bg-[var(--color-accent)] text-xs font-black text-[var(--color-background)]">
                  {type.slice(0, 2)}
                </span>

                <span className="text-sm font-semibold">
                  {type}
                </span>
              </motion.div>
            )
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}