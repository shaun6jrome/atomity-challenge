"use client";

import { motion, AnimatePresence } from "framer-motion";

type Row = {
  name: string;
  cost: number;
};

interface CostTableProps {
  data: Row[];
}

export default function CostTable({
  data,
}: CostTableProps) {
  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl">
      <div className="grid grid-cols-2 border-b border-slate-800 px-6 py-4 text-sm font-medium text-slate-400">
        <span>Resource</span>

        <span className="text-right">
          Monthly Cost
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {data.map((row, index) => (
          <motion.div
            key={row.name}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              delay: index * 0.05,
            }}
            className="grid grid-cols-2 border-b border-slate-800/50 px-6 py-4 last:border-none"
          >
            <span className="font-medium text-white">
              {row.name}
            </span>

            <span className="text-right text-green-400">
              ${row.cost.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}