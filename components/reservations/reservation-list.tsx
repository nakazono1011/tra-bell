"use client";

import Link from "next/link";
import { useState } from "react";
import {
  formatPrice,
  formatDate,
  calculatePriceDrop,
  getDaysUntil,
  isBeforeDeadline,
} from "@/lib/utils";
import {
  getSiteLabel,
  getSiteBadgeColor,
  getStatusBadge,
} from "@/lib/utils/reservation";
import type { Reservation } from "@/db/schema";

interface ReservationListProps {
  reservations: Reservation[];
}

type FilterStatus = "all" | "active" | "cancelled" | "rebooked";
type SortBy = "checkInDate" | "price" | "savings";

export function ReservationList({ reservations }: ReservationListProps) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("checkInDate");

  // フィルタリング
  const filteredReservations = reservations.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  // ソート
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    switch (sortBy) {
      case "checkInDate":
        return (
          new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
        );
      case "price":
        return b.currentPrice - a.currentPrice;
      case "savings":
        const savingsA = a.originalPrice - a.currentPrice;
        const savingsB = b.originalPrice - b.currentPrice;
        return savingsB - savingsA;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">ステータス:</span>
          <div className="flex gap-1">
            {[
              { value: "all" as const, label: "すべて" },
              { value: "active" as const, label: "アクティブ" },
              { value: "cancelled" as const, label: "キャンセル済" },
              { value: "rebooked" as const, label: "再予約済" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === option.value
                    ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-sm text-slate-400">並び替え:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          >
            <option value="checkInDate">チェックイン日</option>
            <option value="price">価格（高い順）</option>
            <option value="savings">節約額（大きい順）</option>
          </select>
        </div>
      </div>

      {/* Reservation Cards */}
      {sortedReservations.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
            <svg
              className="w-8 h-8 text-slate-500"
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
          </div>
          <p className="text-slate-400">予約がありません</p>
          <p className="text-slate-500 text-sm mt-1">
            Gmailを同期して予約を取得するか、手動で追加してください
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedReservations.map((r) => {
            const priceDrop = calculatePriceDrop(
              r.originalPrice,
              r.currentPrice,
            );
            const daysUntilCheckIn = getDaysUntil(r.checkInDate);
            const canCancel = isBeforeDeadline(r.cancellationDeadline);

            return (
              <Link
                key={r.id}
                href={`/dashboard/reservations/${r.id}`}
                className="block p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Hotel Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {r.hotelName}
                      </h3>
                      {getStatusBadge(r.status) && (
                        <span className={getStatusBadge(r.status)!.className}>
                          {getStatusBadge(r.status)!.label}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getSiteBadgeColor(
                          r.reservationSite,
                        )}`}
                      >
                        {getSiteLabel(r.reservationSite)}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(r.checkInDate)} 〜{" "}
                        {formatDate(r.checkOutDate)}
                      </span>
                      {r.roomType && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          {r.roomType}
                        </span>
                      )}
                    </div>

                    {/* Status indicators */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {daysUntilCheckIn > 0 && daysUntilCheckIn <= 7 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-400/10 text-amber-400">
                          あと{daysUntilCheckIn}日
                        </span>
                      )}
                      {r.status === "active" && canCancel && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-400/10 text-emerald-400">
                          無料キャンセル可
                        </span>
                      )}
                      {r.status === "active" && !canCancel && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-400/10 text-red-400">
                          キャンセル料発生
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price Info */}
                  <div className="lg:text-right">
                    <p className="text-2xl font-bold text-white">
                      {formatPrice(r.currentPrice)}
                    </p>
                    {priceDrop.amount > 0 && (
                      <div className="mt-1">
                        <span className="text-sm text-slate-500 line-through">
                          {formatPrice(r.originalPrice)}
                        </span>
                        <span className="ml-2 text-sm font-medium text-emerald-400">
                          ↓ {formatPrice(priceDrop.amount)} (
                          {priceDrop.percentage}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
