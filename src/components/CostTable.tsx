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

export default function CostTable({ data }: CostTableProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="metrics-table border-t border-[var(--color-border)]">
      <table className="w-full min-w-[52rem] border-collapse text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
            <th scope="col" className="px-7 py-5 font-medium">
              Resource
            </th>
            {columns.map((column) => (
              <th key={column.key} scope="col" className="px-4 py-5 text-right font-medium">
                {column.label}
              </th>
            ))}
            <th scope="col" className="px-4 py-5 text-right font-medium">
              Efficiency
            </th>
            <th scope="col" className="px-7 py-5 text-right font-medium">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={reduceMotion ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-muted)]"
            >
              <th scope="row" className="max-w-56 truncate px-7 py-4 text-left font-semibold">
                {row.name}
              </th>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-4 text-right tabular-nums text-[var(--color-text-secondary)]"
                >
                  ${row.metrics[column.key].toLocaleString()}
                </td>
              ))}
              <td className="px-4 py-4 text-right tabular-nums text-[var(--color-text-secondary)]">
                {row.metrics.efficiency}%
              </td>
              <td className="px-7 py-4 text-right font-semibold tabular-nums text-[var(--color-accent)]">
                ${row.metrics.total.toLocaleString()}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
