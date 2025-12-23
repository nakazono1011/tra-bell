'use client';

import {
  formatPrice,
  formatDateShort,
  formatDateTime,
} from '@/lib/utils';
import type { PriceHistory } from '@/db/schema';
import {
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface PriceHistoryChartProps {
  priceHistory: PriceHistory[];
  originalPrice: number;
}

export function PriceHistoryChart({
  priceHistory,
  originalPrice,
}: PriceHistoryChartProps) {
  if (priceHistory.length === 0) {
    return (
      <div className="bg-white">
        <div className="px-4 pb-6 pt-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                価格履歴
              </h2>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                  <span className="text-[var(--text-secondary)] font-medium">
                    価格推移
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-50" />
                  <span className="text-[var(--text-secondary)] font-medium">
                    予約時価格
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg-secondary)] mb-4">
                <svg
                  className="w-6 h-6 text-[var(--text-secondary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
              </div>
              <p className="text-[var(--text-secondary)] font-medium">
                価格履歴はまだありません
              </p>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                価格チェックが実行されると履歴が記録されます
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 価格データを時系列順に並び替え
  const sortedHistory = [...priceHistory].sort(
    (a, b) =>
      new Date(a.checkedAt).getTime() -
      new Date(b.checkedAt).getTime()
  );

  // Recharts用のデータ形式に変換
  const chartData = sortedHistory.map((h) => ({
    date: formatDateShort(h.checkedAt),
    dateTime: formatDateTime(h.checkedAt),
    price: h.price,
    checkedAt: h.checkedAt,
  }));

  // 最小・最大価格を計算
  const prices = sortedHistory.map((h) => h.price);
  const minPrice = Math.min(...prices, originalPrice);
  const maxPrice = Math.max(...prices, originalPrice);

  // ¥500単位のY軸目盛りを生成
  const generateYAxisTicks = (
    min: number,
    max: number
  ): number[] => {
    // 最小値を¥500単位で切り下げ
    const minTick = Math.floor(min / 500) * 500;
    // 最大値を¥500単位で切り上げ
    const maxTick = Math.ceil(max / 500) * 500;
    const ticks: number[] = [];

    // ¥500単位で配列を生成
    for (
      let price = minTick;
      price <= maxTick;
      price += 500
    ) {
      ticks.push(price);
    }

    return ticks;
  };

  const yAxisTicks = generateYAxisTicks(minPrice, maxPrice);

  // チャート設定
  const chartConfig = {
    price: {
      label: '価格',
      color: 'hsl(142, 76%, 36%)', // emerald-600
    },
  };

  return (
    <div className="bg-white">
      <div className="px-6 py-4">
        {/* Chart */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              価格履歴
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                <span className="text-[var(--text-secondary)] font-medium">
                  価格推移
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 opacity-50" />
                <span className="text-[var(--text-secondary)] font-medium">
                  予約時価格
                </span>
              </div>
            </div>
          </div>
          <ChartContainer
            config={chartConfig}
            className="h-[220px] w-full"
          >
            <LineChart
              data={chartData}
              margin={{
                top: 0,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#e2e8f0"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{
                  fill: 'var(--text-tertiary)',
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value, index) => {
                  // 最初のデータポイントは常に表示
                  if (index === 0) {
                    return value;
                  }
                  // 前のデータポイントの日付と比較
                  const currentDate = value;
                  const previousDate =
                    chartData[index - 1]?.date;
                  // 日付が異なる場合のみ表示、同じ場合は空文字列を返して非表示
                  return currentDate !== previousDate
                    ? value
                    : '';
                }}
              />
              <YAxis
                tick={{
                  fill: 'var(--text-tertiary)',
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
                domain={[minPrice * 0.95, maxPrice * 1.05]}
                ticks={yAxisTicks}
                tickFormatter={(value) =>
                  formatPrice(value)
                }
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (
                    !active ||
                    !payload ||
                    payload.length === 0
                  ) {
                    return null;
                  }
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-gray-900 px-3 py-2 text-xs shadow-lg">
                      <div className="font-semibold text-white mb-1">
                        {formatPrice(data.price)}
                      </div>
                      <div className="text-gray-300">
                        {data.dateTime}
                      </div>
                    </div>
                  );
                }}
                cursor={{
                  stroke: '#10b981',
                  strokeWidth: 2,
                }}
              />
              <ReferenceLine
                y={originalPrice}
                stroke="#fbbf24"
                strokeDasharray="4 4"
                strokeOpacity={0.6}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={3}
                dot={(props) => {
                  const isLast =
                    props.index === chartData.length - 1;
                  if (isLast) {
                    return (
                      <g key={`dot-${props.index}`}>
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={8}
                          fill="#10b981"
                          opacity={0.2}
                          className="animate-pulse"
                        />
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={5}
                          fill="#fff"
                          stroke="#10b981"
                          strokeWidth={2.5}
                        />
                      </g>
                    );
                  }
                  return (
                    <circle
                      key={`dot-${props.index}`}
                      cx={props.cx}
                      cy={props.cy}
                      r={3.5}
                      fill="#fff"
                      stroke="#10b981"
                      strokeWidth={2.5}
                    />
                  );
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 3,
                  fill: '#10b981',
                }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
