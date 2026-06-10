"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ResourceNode } from "../libs/api";

type CostTableProps = {
  data: ResourceNode[];
};

const columns = [
  { key: "cpu", label: "CPU" },
  { key: "ram", label: "RAM" },
  { key: "storage", label: "Storage" },
  { key: "network", label: "Network" },
  { key: "gpu", label: "GPU" },
] as const;

export default function CostTable({
  data,
}: CostTableProps) {
  const reduceMotion = useReducedMotion();

  const rankedData = [...data].sort(
    (a, b) => b.metrics.total - a.metrics.total
  );

  const highestCost = Math.max(
    ...data.map(
      (resource) => resource.metrics.total
    ),
    1
  );

  return (
    <div className="metrics-table border-t border-[var(--color-border)]">
      <table className="w-full min-w-[56rem] border-collapse text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            <th
              scope="col"
              className="px-7 py-5 font-medium"
            >
              Resource
            </th>

            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-4 py-5 text-right font-medium"
              >
                {column.label}
              </th>
            ))}

            <th
              scope="col"
              className="px-4 py-5 text-right font-medium"
            >
              Efficiency
            </th>

            <th
              scope="col"
              className="px-7 py-5 text-right font-medium"
            >
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => {
            const rank =
              rankedData.findIndex(
                (item) => item.id === row.id
              ) + 1;

            const spendRatio =
              row.metrics.total /
              highestCost;

            return (
              <motion.tr
                key={row.id}
                initial={
                  reduceMotion
                    ? false
                    : {
                        opacity: 0,
                        x: -12,
                      }
                }
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
                className="group border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-muted)]"
              >
                <th
                  scope="row"
                  className="px-7 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-7 min-w-[2rem] items-center justify-center rounded-full text-xs font-bold ${
                        rank <= 3
                          ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                          : "bg-white/5 text-[var(--color-text-secondary)]"
                      }`}
                    >
                      #{rank}
                    </span>

                    <div className="min-w-0">
                      <div className="truncate font-semibold">
                        {row.name}
                      </div>

                      {spendRatio >= 0.8 && (
                        <div className="mt-1 text-xs text-[var(--color-text-secondary)]">
                          High spend resource
                        </div>
                      )}
                    </div>
                  </div>
                </th>

                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-4 text-right tabular-nums text-[var(--color-text-secondary)]"
                  >
                    $
                    {row.metrics[
                      column.key
                    ].toLocaleString()}
                  </td>
                ))}

                <td className="px-4 py-4 text-right tabular-nums text-[var(--color-text-secondary)]">
                  {row.metrics.efficiency}%
                </td>

                <td className="px-7 py-4 text-right">
                  <span className="font-bold tabular-nums text-[var(--color-accent)]">
                    $
                    {row.metrics.total.toLocaleString()}
                  </span>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}