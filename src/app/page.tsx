"use client";

import { useProducts } from "../hooks/useProducts";
import AnimatedCard from "../components/AnimatedCard";
import CountUp from "react-countup";
import {
  Sparkles,
  TrendingDown,
  ShieldCheck,
  Activity,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

const SERVICE_NAMES = [
  "Kubernetes Cluster",
  "EC2 Compute Pool",
  "RDS Database",
  "S3 Storage",
  "Load Balancer",
  "Redis Cache",
  "API Gateway",
  "Analytics Engine",
  "Data Pipeline",
  "Monitoring Stack",
  "Container Registry",
  "Message Queue",
];

export default function Home() {
  const { data, isLoading, error } = useProducts();

  const services = data ?? [];

  const totalSpend = services.reduce(
    (sum: number, item: any) => sum + item.price * 50,
    0
  );

  const avgHealth =
    services.length > 0
      ? (
          services.reduce(
            (sum: number, item: any) => sum + item.rating,
            0
          ) / services.length
        ).toFixed(1)
      : "0";

  const chartData = [
    { month: "Jan", spend: 8400 },
    { month: "Feb", spend: 7900 },
    { month: "Mar", spend: 9500 },
    { month: "Apr", spend: 7100 },
    { month: "May", spend: 6800 },
    { month: "Jun", spend: 6577 },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b12] text-white">
      {/* Background Effects */}

      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[140px]" />

      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-8 py-12">
        {/* HERO */}

        <AnimatedCard delay={0.1}>
          <div className="mb-12">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              <Sparkles size={16} />
              AI Cost Optimization Platform
            </div>

            <h1 className="text-6xl font-bold tracking-tight">
              Cloud Cost Intelligence
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-slate-400">
              Real-time visibility into cloud infrastructure costs,
              utilization trends and AI-powered optimization opportunities.
            </p>
          </div>
        </AnimatedCard>

        {/* KPI ROW */}

        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <AnimatedCard delay={0.15}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-sm text-slate-400">
                Monthly Spend
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                $
                <CountUp
                  end={totalSpend}
                  duration={2}
                  separator=","
                />
              </h2>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-sm text-slate-400">
                Active Services
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                <CountUp
                  end={services.length}
                  duration={2}
                />
              </h2>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.25}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-sm text-slate-400">
                Potential Savings
              </p>

              <h2 className="mt-3 text-4xl font-bold text-green-400">
                $
                <CountUp
                  end={totalSpend * 0.18}
                  duration={2}
                />
              </h2>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.3}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-sm text-slate-400">
                Health Score
              </p>

              <h2 className="mt-3 text-4xl font-bold">
                {avgHealth}
              </h2>
            </div>
          </AnimatedCard>
        </div>

        {/* CHART + AI PANEL */}

        <div className="mb-10 grid gap-6 xl:grid-cols-3">
          <AnimatedCard delay={0.35}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl xl:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">
                  Cost Trend Analysis
                </h2>

                <p className="text-slate-400">
                  Monthly cloud spend forecast
                </p>
              </div>

              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="green"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#22c55e"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="#22c55e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="month"
                      stroke="#64748b"
                    />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="spend"
                      stroke="#22c55e"
                      fill="url(#green)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.4}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <h2 className="mb-6 text-xl font-semibold">
                AI Recommendations
              </h2>

              <div className="space-y-4">
                <div className="rounded-xl bg-green-500/10 p-4">
                  <TrendingDown
                    size={20}
                    className="mb-2 text-green-400"
                  />

                  <p className="font-medium">
                    Rightsize EC2 instances
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Save approximately $1,184/month
                  </p>
                </div>

                <div className="rounded-xl bg-cyan-500/10 p-4">
                  <ShieldCheck
                    size={20}
                    className="mb-2 text-cyan-400"
                  />

                  <p className="font-medium">
                    Enable Reserved Capacity
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Improve utilization by 22%
                  </p>
                </div>

                <div className="rounded-xl bg-purple-500/10 p-4">
                  <Activity
                    size={20}
                    className="mb-2 text-purple-400"
                  />

                  <p className="font-medium">
                    Database Optimization
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Reduce idle resources detected
                  </p>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>

        {/* SERVICES */}

        {!isLoading && !error && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.slice(0, 12).map((item: any, index: number) => (
              <AnimatedCard
                key={item.id}
                delay={0.45 + index * 0.04}
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500">
                        Infrastructure
                      </p>

                      <h3 className="mt-2 font-semibold">
                        {SERVICE_NAMES[index]}
                      </h3>
                    </div>

                    <div className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                      Healthy
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm text-slate-400">
                      Monthly Cost
                    </p>

                    <p className="mt-1 text-3xl font-bold text-green-400">
                      ${Math.round(item.price * 50)}
                    </p>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        Resources
                      </span>

                      <span>
                        {Math.floor(item.stock / 2)}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        Efficiency
                      </span>

                      <span>
                        {Math.round(item.rating * 20)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-400">
                        Utilization
                      </span>

                      <span>
                        {Math.round(item.rating * 20)}%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                        style={{
                          width: `${Math.min(
                            item.rating * 20,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}