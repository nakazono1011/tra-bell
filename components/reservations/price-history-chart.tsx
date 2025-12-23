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
      <div className="rounded-2xl border border-[var(--bg-tertiary)] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          価格履歴
        </h2>
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

  // 現在価格と予約時価格の差
  const currentPrice =
    sortedHistory[sortedHistory.length - 1]?.price ||
    originalPrice;
  const priceDiff = originalPrice - currentPrice;
  const isLower = priceDiff > 0;

  // チャート設定
  const chartConfig = {
    price: {
      label: '価格',
      color: 'hsl(142, 76%, 36%)', // emerald-600
    },
  };

  return (
    <div className="rounded-2xl border border-[var(--bg-tertiary)] bg-white overflow-hidden shadow-sm">
      <div className="p-6 border-b border-[var(--bg-tertiary)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            価格履歴
          </h2>
          <div className="flex items-center gap-4 text-sm">
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
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 rounded-2xl bg-[var(--bg-warm)] border border-orange-100">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wide">
              最高価格
            </p>
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {formatPrice(maxPrice)}
            </p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wide">
              最低価格
            </p>
            <p className="text-lg font-bold text-emerald-600">
              {formatPrice(minPrice)}
            </p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)]">
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase tracking-wide">
              変動幅
            </p>
            <p
              className={`text-lg font-bold ${
                isLower
                  ? 'text-emerald-600'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {isLower ? '↓' : ''}{' '}
              {formatPrice(Math.abs(priceDiff))}
            </p>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer
          config={chartConfig}
          className="h-[220px] w-full"
        >
          <LineChart
            data={chartData}
            margin={{
              top: 5,
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
              tickFormatter={(value) => formatPrice(value)}
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
              cursor={{ stroke: '#10b981', strokeWidth: 2 }}
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
  );
}
