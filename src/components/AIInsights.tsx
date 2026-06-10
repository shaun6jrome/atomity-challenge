export default function AIInsights() {
  const insights = [
    {
      title: "Idle RDS Instance",
      savings: "$240/mo",
    },
    {
      title: "Oversized Compute Pool",
      savings: "$380/mo",
    },
    {
      title: "Unused Storage Volume",
      savings: "$95/mo",
    },
  ];

  return (
    <div className="space-y-4">
      {insights.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4"
        >
          <h3 className="font-medium">
            {item.title}
          </h3>

          <p className="mt-1 text-yellow-400">
            Potential savings {item.savings}
          </p>
        </div>
      ))}
    </div>
  );
}