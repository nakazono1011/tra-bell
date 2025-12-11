import { formatPrice } from "@/lib/utils";

interface DashboardStatsProps {
  totalReservations: number;
  activeReservations: number;
  totalSavings: number;
  pendingPriceDrops: number;
}

export function DashboardStats({
  totalReservations,
  activeReservations,
  totalSavings,
  pendingPriceDrops,
}: DashboardStatsProps) {
  const stats = [
    {
      name: "アクティブな予約",
      value: activeReservations.toString(),
      subtext: `全${totalReservations}件`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "累計節約額",
      value: formatPrice(totalSavings),
      subtext: "自動再予約による",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "from-emerald-400 to-emerald-600",
    },
    {
      name: "値下がり検知",
      value: pendingPriceDrops.toString(),
      subtext: "対応待ち",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
      ),
      color: "from-amber-400 to-amber-600",
    },
    {
      name: "価格監視中",
      value: activeReservations.toString(),
      subtext: "24時間体制",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      color: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400">{stat.name}</p>
              <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500">{stat.subtext}</p>
            </div>
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} text-white`}
            >
              {stat.icon}
            </div>
          </div>
          <div
            className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}
          />
        </div>
      ))}
    </div>
  );
}
