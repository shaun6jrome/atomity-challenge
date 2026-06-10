"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ResourceNode } from "../libs/api";

type ResourceChartProps = {
  nodes: ResourceNode[];
  canDrillDown: boolean;
  onSelect: (node: ResourceNode) => void;
};

function shortName(name: string) {
  return name.length > 22
    ? `${name.slice(0, 20)}…`
    : name;
}

export default function ResourceChart({
  nodes,
  canDrillDown,
  onSelect,
}: ResourceChartProps) {
  const reduceMotion =
    useReducedMotion();

  const maxCost = Math.max(
    ...nodes.map(
      (node) => node.metrics.total
    ),
    1
  );

  return (
    <div className="metrics-table">
      <div className="chart-stage min-w-[42rem] px-5 pb-4 pt-10 sm:px-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-secondary)]">
            Monthly Cost Distribution
          </p>

          {canDrillDown && (
            <p className="text-xs text-[var(--color-text-secondary)]">
              Click a bar to drill down
            </p>
          )}
        </div>

        <div
          className="chart-grid grid h-72 items-end gap-4 px-2"
          style={{
            gridTemplateColumns: `repeat(${nodes.length}, minmax(7rem, 1fr))`,
          }}
        >
          {nodes.map(
            (node, index) => {
              const normalized =
                Math.sqrt(
                  node.metrics.total /
                    maxCost
                );

              const height =
                Math.max(
                  normalized * 100,
                  18
                );

              return (
                <motion.button
                  key={node.id}
                  type="button"
                  disabled={
                    !canDrillDown
                  }
                  onClick={() =>
                    onSelect(node)
                  }
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 24,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.08,
                    duration: 0.45,
                  }}
                  whileHover={
                    canDrillDown &&
                    !reduceMotion
                      ? {
                          y: -5,
                        }
                      : undefined
                  }
                  className="resource-bar group flex h-full flex-col justify-end text-center"
                  aria-label={
                    canDrillDown
                      ? `Open ${node.name}, monthly cost $${node.metrics.total.toLocaleString()}`
                      : `${node.name}, monthly cost $${node.metrics.total.toLocaleString()}`
                  }
                >
                  <div className="mb-3 flex flex-col items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                        index < 3
                          ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                          : "bg-white/5 text-[var(--color-text-secondary)]"
                      }`}
                    >
                      #{index + 1}
                    </span>

                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      $
                      {node.metrics.total.toLocaleString()}
                    </span>
                  </div>

                  <motion.span
                    initial={
                      reduceMotion
                        ? false
                        : {
                            height: 0,
                          }
                    }
                    animate={{
                      height: `${height}%`,
                    }}
                    transition={{
                      delay:
                        index * 0.08,
                      duration:
                        reduceMotion
                          ? 0
                          : 0.8,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    }}
                    className="
                      relative
                      block
                      min-h-8
                      w-full
                      overflow-hidden
                      rounded-t-2xl
                      rounded-b-md
                      bg-[var(--color-accent)]
                      shadow-[0_0_35px_var(--color-glow)]
                    "
                  >
                    <span className="absolute inset-x-0 top-0 h-px bg-white/70" />
                  </motion.span>

                  <span className="mt-4 block min-h-10 text-sm font-semibold leading-5">
                    {shortName(
                      node.name
                    )}
                  </span>
                </motion.button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}