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
    (a, b) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime()
  );

  // 最小・最大価格を計算
  const prices = sortedHistory.map((h) => h.price);
  const minPrice = Math.min(...prices, originalPrice);
  const maxPrice = Math.max(...prices, originalPrice);
  const priceRange = maxPrice - minPrice || 1;

  // チャートの高さを計算
  const chartHeight = 220; // 少し高くして見やすく
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
  const currentPrice =
    sortedHistory[sortedHistory.length - 1]?.price || originalPrice;
  const priceDiff = originalPrice - currentPrice;
  const isLower = priceDiff > 0;

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
                isLower ? "text-emerald-600" : "text-[var(--text-secondary)]"
              }`}
            >
              {isLower ? "↓" : ""} {formatPrice(Math.abs(priceDiff))}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="relative h-[220px] w-full pl-12">
          <svg
            viewBox={`0 0 100 ${chartHeight}`}
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={(y / 100) * chartHeight}
                x2="100"
                y2={(y / 100) * chartHeight}
                stroke="rgb(226, 232, 240)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Original price line */}
            <line
              x1="0"
              y1={getY(originalPrice)}
              x2="100"
              y2={getY(originalPrice)}
              stroke="rgb(251, 191, 36)"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
            />

            {/* Area fill */}
            <path d={areaPath} fill="url(#gradient)" opacity="0.15" />

            {/* Line */}
            <path
              d={pathPoints}
              fill="none"
              stroke="rgb(16, 185, 129)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {sortedHistory.map((h, i) => {
              const x = (i / (sortedHistory.length - 1 || 1)) * 100;
              const y = getY(h.price);
              const isLast = i === sortedHistory.length - 1;

              return (
                <g key={h.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isLast ? "5" : "3.5"}
                    fill="white"
                    stroke="rgb(16, 185, 129)"
                    strokeWidth="2.5"
                    className="transition-all duration-300 hover:r-6"
                  />
                  {isLast && (
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="rgb(16, 185, 129)"
                      opacity="0.2"
                      className="animate-pulse"
                    />
                  )}
                </g>
              );
            })}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(16, 185, 129)" />
                <stop
                  offset="100%"
                  stopColor="rgb(16, 185, 129)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs font-medium text-[var(--text-tertiary)] pr-3 select-none">
            <span>{formatPrice(maxPrice)}</span>
            <span>{formatPrice(minPrice)}</span>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between mt-3 text-xs font-medium text-[var(--text-tertiary)] pl-12 select-none">
          {sortedHistory.length > 0 && (
            <>
              <span>{formatDateShort(sortedHistory[0].checkedAt)}</span>
              <span>
                {formatDateShort(
                  sortedHistory[sortedHistory.length - 1].checkedAt
                )}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
