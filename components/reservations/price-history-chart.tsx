"use client";

import { formatPrice, formatDateShort } from "@/lib/utils";
import type { PriceHistory } from "@/db/schema";

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
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">価格履歴</h2>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 mb-4">
            <svg
              className="w-6 h-6 text-slate-500"
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
          <p className="text-slate-400">価格履歴はまだありません</p>
          <p className="text-slate-500 text-sm mt-1">
            価格チェックが実行されると履歴が記録されます
          </p>
        </div>
      </div>
    );
  }

  // 価格データを時系列順に並び替え
  const sortedHistory = [...priceHistory].sort(
    (a, b) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime()
  );

  // 最小・最大価格を計算
  const prices = sortedHistory.map((h) => h.price);
  const minPrice = Math.min(...prices, originalPrice);
  const maxPrice = Math.max(...prices, originalPrice);
  const priceRange = maxPrice - minPrice || 1;

  // チャートの高さを計算
  const chartHeight = 200;
  const getY = (price: number) =>
    chartHeight - ((price - minPrice) / priceRange) * chartHeight;

  // SVGパスを生成
  const pathPoints = sortedHistory
    .map((h, i) => {
      const x = (i / (sortedHistory.length - 1 || 1)) * 100;
      const y = getY(h.price);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  // 塗りつぶし用のパス
  const areaPath = `${pathPoints} L 100 ${chartHeight} L 0 ${chartHeight} Z`;

  // 現在価格と予約時価格の差
  const currentPrice = sortedHistory[sortedHistory.length - 1]?.price || originalPrice;
  const priceDiff = originalPrice - currentPrice;
  const isLower = priceDiff > 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">価格履歴</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-slate-400">価格推移</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-amber-400" />
              <span className="text-slate-400">予約時価格</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 rounded-xl bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-1">最高価格</p>
            <p className="text-lg font-semibold text-white">
              {formatPrice(maxPrice)}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-1">最低価格</p>
            <p className="text-lg font-semibold text-emerald-400">
              {formatPrice(minPrice)}
            </p>
          </div>
          <div className="text-center p-3 rounded-xl bg-slate-800/50">
            <p className="text-xs text-slate-400 mb-1">変動幅</p>
            <p
              className={`text-lg font-semibold ${
                isLower ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              {isLower ? "↓" : ""} {formatPrice(Math.abs(priceDiff))}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-[200px] w-full">
          <svg
            viewBox={`0 0 100 ${chartHeight}`}
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={(y / 100) * chartHeight}
                x2="100"
                y2={(y / 100) * chartHeight}
                stroke="rgb(51, 65, 85)"
                strokeWidth="0.5"
              />
            ))}

            {/* Original price line */}
            <line
              x1="0"
              y1={getY(originalPrice)}
              x2="100"
              y2={getY(originalPrice)}
              stroke="rgb(251, 191, 36)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />

            {/* Area fill */}
            <path
              d={areaPath}
              fill="url(#gradient)"
              opacity="0.2"
            />

            {/* Line */}
            <path
              d={pathPoints}
              fill="none"
              stroke="rgb(52, 211, 153)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {sortedHistory.map((h, i) => {
              const x = (i / (sortedHistory.length - 1 || 1)) * 100;
              const y = getY(h.price);
              return (
                <circle
                  key={h.id}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="rgb(52, 211, 153)"
                  stroke="rgb(15, 23, 42)"
                  strokeWidth="2"
                />
              );
            })}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(52, 211, 153)" />
                <stop offset="100%" stopColor="rgb(52, 211, 153)" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-slate-500 -translate-x-full pr-2">
            <span>{formatPrice(maxPrice)}</span>
            <span>{formatPrice(minPrice)}</span>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          {sortedHistory.length > 0 && (
            <>
              <span>{formatDateShort(sortedHistory[0].checkedAt)}</span>
              <span>
                {formatDateShort(sortedHistory[sortedHistory.length - 1].checkedAt)}
              </span>
            </>
          )}
        </div>

        {/* History Table */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-400 mb-3">履歴詳細</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sortedHistory
              .slice()
              .reverse()
              .map((h, i, arr) => {
                const prevPrice = arr[i + 1]?.price;
                const diff = prevPrice ? h.price - prevPrice : 0;
                return (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                  >
                    <span className="text-sm text-slate-400">
                      {formatDateShort(h.checkedAt)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-white">
                        {formatPrice(h.price)}
                      </span>
                      {diff !== 0 && (
                        <span
                          className={`text-xs ${
                            diff < 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {diff < 0 ? "↓" : "↑"} {formatPrice(Math.abs(diff))}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}



