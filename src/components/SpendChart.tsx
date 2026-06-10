"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", spend: 4200 },
  { month: "Feb", spend: 4800 },
  { month: "Mar", spend: 5100 },
  { month: "Apr", spend: 4600 },
  { month: "May", spend: 6200 },
  { month: "Jun", spend: 6577 },
];

export default function SpendChart() {
  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis dataKey="month" />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="spend"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.15}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}