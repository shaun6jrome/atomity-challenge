"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ResourceNode } from "../libs/api";

type ResourceChartProps = {
  nodes: ResourceNode[];
  canDrillDown: boolean;
  onSelect: (node: ResourceNode) => void;
};

function shortName(name: string) {
  return name.length > 22 ? `${name.slice(0, 20)}…` : name;
}

export default function ResourceChart({
  nodes,
  canDrillDown,
  onSelect,
}: ResourceChartProps) {
  const reduceMotion = useReducedMotion();
  const maxCost = Math.max(...nodes.map((node) => node.metrics.total), 1);

  return (
    <div className="metrics-table">
      <div className="chart-stage min-w-[42rem] px-5 pb-4 pt-10 sm:px-8">
        <div
          className="chart-grid grid h-72 items-end gap-4 px-2"
          style={{
            gridTemplateColumns: `repeat(${nodes.length}, minmax(7rem, 1fr))`,
          }}
        >
          {nodes.map((node, index) => {
            const height = Math.max((node.metrics.total / maxCost) * 100, 12);

            return (
              <motion.button
                key={node.id}
                type="button"
                disabled={!canDrillDown}
                onClick={() => onSelect(node)}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                whileHover={canDrillDown && !reduceMotion ? { y: -5 } : undefined}
                className="resource-bar group flex h-full flex-col justify-end text-center"
                aria-label={
                  canDrillDown
                    ? `Open ${node.name}, monthly cost $${node.metrics.total.toLocaleString()}`
                    : `${node.name}, monthly cost $${node.metrics.total.toLocaleString()}`
                }
              >
                <span className="mb-3 text-xs font-semibold text-[var(--color-text-secondary)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  ${node.metrics.total.toLocaleString()}
                </span>
                <motion.span
                  initial={reduceMotion ? false : { height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    delay: index * 0.08,
                    duration: reduceMotion ? 0 : 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative block min-h-8 w-full overflow-hidden rounded-t-2xl rounded-b-md bg-[var(--color-accent)] shadow-[0_0_35px_var(--color-glow)]"
                >
                  <span className="absolute inset-x-0 top-0 h-px bg-white/70" />
                </motion.span>
                <span className="mt-4 block min-h-10 text-sm font-semibold leading-5">
                  {shortName(node.name)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
