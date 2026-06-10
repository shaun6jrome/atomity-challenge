"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Node = {
  name: string;
  cost: number;
};

const DATA = {
  cluster: [
    { name: "Production", cost: 12400 },
    { name: "AI Training", cost: 9800 },
    { name: "Analytics", cost: 7600 },
    { name: "Monitoring", cost: 4100 },
  ],

  namespaces: {
    Production: [
      { name: "api-services", cost: 6200 },
      { name: "customer-data", cost: 3800 },
      { name: "payments", cost: 2400 },
    ],

    "AI Training": [
      { name: "gpu-workers", cost: 5100 },
      { name: "training-jobs", cost: 2800 },
      { name: "inference", cost: 1900 },
    ],

    Analytics: [
      { name: "warehouse", cost: 3200 },
      { name: "etl-pipelines", cost: 2400 },
      { name: "reporting", cost: 2000 },
    ],

    Monitoring: [
      { name: "logs", cost: 1700 },
      { name: "metrics", cost: 1300 },
      { name: "alerts", cost: 1100 },
    ],
  },

  pods: {
    "gpu-workers": [
      { name: "trainer-01", cost: 2200 },
      { name: "trainer-02", cost: 1700 },
      { name: "trainer-03", cost: 800 },
      { name: "trainer-04", cost: 400 },
    ],
  },
};

export default function ResourceDiscovery() {
  const [level, setLevel] = useState<
    "cluster" | "namespace" | "pod"
  >("cluster");

  const [cluster, setCluster] = useState("");
  const [namespace, setNamespace] = useState("");

  let currentData: Node[] = [];
  let breadcrumb = "Cluster";

  if (level === "cluster") {
    currentData = DATA.cluster;
  }

  if (level === "namespace") {
    currentData =
      DATA.namespaces[
        cluster as keyof typeof DATA.namespaces
      ] || [];

    breadcrumb = `${cluster} / Namespace`;
  }

  if (level === "pod") {
    currentData =
      DATA.pods[
        namespace as keyof typeof DATA.pods
      ] || [];

    breadcrumb = `${cluster} / ${namespace} / Pods`;
  }

  const maxCost = Math.max(
    ...currentData.map((d) => d.cost),
    1
  );

  function handleClick(item: Node) {
    if (level === "cluster") {
      setCluster(item.name);
      setLevel("namespace");
    }

    else if (
      level === "namespace" &&
      item.name === "gpu-workers"
    ) {
      setNamespace(item.name);
      setLevel("pod");
    }
  }

  function goBack() {
    if (level === "pod") {
      setLevel("namespace");
      return;
    }

    if (level === "namespace") {
      setLevel("cluster");
    }
  }

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-green-400">
              Aggregated By
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {breadcrumb}
            </h2>

            <p className="mt-4 max-w-2xl text-slate-400">
              Drill into infrastructure costs from
              clusters down to workload level.
            </p>
          </div>

          {level !== "cluster" && (
            <button
              onClick={goBack}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:border-green-400"
            >
              Back
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={breadcrumb}
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -30,
            }}
            transition={{
              duration: 0.35,
            }}
            className="space-y-6"
          >
            {currentData.map((item, index) => (
              <motion.button
                key={item.name}
                onClick={() =>
                  handleClick(item)
                }
                initial={{
                  opacity: 0,
                  x: -40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                className="w-full text-left"
              >
                <div className="mb-2 flex justify-between">
                  <span className="font-medium">
                    {item.name}
                  </span>

                  <span className="text-green-400">
                    $
                    {item.cost.toLocaleString()}
                  </span>
                </div>

                <div className="h-4 rounded-full bg-slate-800">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${
                        (item.cost / maxCost) * 100
                      }%`,
                    }}
                    transition={{
                      duration: 0.8,
                    }}
                    className="h-4 rounded-full bg-green-400"
                  />
                </div>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}