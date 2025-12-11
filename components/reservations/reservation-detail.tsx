"use client";

import { useState } from "react";
import {
  formatPrice,
  formatDate,
  formatDateTime,
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

interface ReservationDetailProps {
  reservation: Reservation;
}

export function ReservationDetail({ reservation }: ReservationDetailProps) {
  const [isCheckingPrice, setIsCheckingPrice] = useState(false);

  const priceDrop = calculatePriceDrop(
    reservation.originalPrice,
    reservation.currentPrice,
  );
  const daysUntilCheckIn = getDaysUntil(reservation.checkInDate);
  const canCancel = isBeforeDeadline(reservation.cancellationDeadline);

  const handleCheckPrice = async () => {
    setIsCheckingPrice(true);
    try {
      // TODO: 価格チェックAPI呼び出し
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsCheckingPrice(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">
                {reservation.hotelName}
              </h1>
              {getStatusBadge(reservation.status) && (
                <span
                  className={`${getStatusBadge(reservation.status)!.className} px-3 py-1 text-sm`}
                >
                  {getStatusBadge(reservation.status)!.label}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getSiteBadgeColor(
                  reservation.reservationSite,
                )}`}
              >
                {getSiteLabel(reservation.reservationSite)}
              </span>
              <span className="text-sm text-slate-400">
                予約番号: {reservation.reservationId}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCheckPrice}
              disabled={isCheckingPrice || reservation.status !== "active"}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingPrice ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  チェック中...
                </>
              ) : (
                <>
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  価格をチェック
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="p-6 border-b border-slate-800 bg-slate-800/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-slate-400 mb-1">現在の価格</p>
            <p className="text-3xl font-bold text-white">
              {formatPrice(reservation.currentPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">予約時の価格</p>
            <p className="text-2xl font-semibold text-slate-500">
              {formatPrice(reservation.originalPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">節約額</p>
            {priceDrop.amount > 0 ? (
              <div>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatPrice(priceDrop.amount)}
                </p>
                <p className="text-sm text-emerald-400/80">
                  ({priceDrop.percentage}% OFF)
                </p>
              </div>
            ) : (
              <p className="text-2xl font-semibold text-slate-500">¥0</p>
            )}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">宿泊日程</p>
              <p className="text-white">
                {formatDate(reservation.checkInDate)} 〜{" "}
                {formatDate(reservation.checkOutDate)}
              </p>
              {daysUntilCheckIn > 0 && (
                <p className="text-sm text-slate-500 mt-1">
                  チェックインまであと{daysUntilCheckIn}日
                </p>
              )}
            </div>

            {reservation.roomType && (
              <div>
                <p className="text-sm text-slate-400 mb-1">
                  プラン・部屋タイプ
                </p>
                <p className="text-white">{reservation.roomType}</p>
              </div>
            )}

            {reservation.guestCount && (
              <div>
                <p className="text-sm text-slate-400 mb-1">宿泊人数</p>
                <p className="text-white">{reservation.guestCount}名</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400 mb-1">キャンセル期限</p>
              {reservation.cancellationDeadline ? (
                <div>
                  <p className="text-white">
                    {formatDateTime(reservation.cancellationDeadline)}
                  </p>
                  {canCancel ? (
                    <p className="text-sm text-emerald-400 mt-1">
                      ✓ 無料キャンセル可能
                    </p>
                  ) : (
                    <p className="text-sm text-red-400 mt-1">
                      ✗ キャンセル料が発生します
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-slate-500">不明</p>
              )}
            </div>

            <div>
              <p className="text-sm text-slate-400 mb-1">予約登録日</p>
              <p className="text-white">
                {formatDateTime(reservation.createdAt)}
              </p>
            </div>

            {reservation.hotelUrl && (
              <div>
                <a
                  href={reservation.hotelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  ホテルページを開く
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
