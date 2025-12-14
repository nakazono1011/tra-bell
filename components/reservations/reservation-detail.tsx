"use client";

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
import {
  Calendar,
  Users,
  Bed,
  Clock,
  ExternalLink,
  CalendarClock,
} from "lucide-react";

interface ReservationDetailProps {
  reservation: Reservation;
}

export function ReservationDetail({ reservation }: ReservationDetailProps) {
  const priceDrop = calculatePriceDrop(
    reservation.originalPrice,
    reservation.currentPrice
  );
  const daysUntilCheckIn = getDaysUntil(reservation.checkInDate);
  const canCancel = isBeforeDeadline(reservation.cancellationDeadline);

  return (
    <div className="rounded-2xl border border-[var(--bg-tertiary)] bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-[var(--bg-tertiary)] bg-white">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSiteBadgeColor(
                    reservation.reservationSite
                  )}`}
                >
                  {getSiteLabel(reservation.reservationSite)}
                </span>
                {getStatusBadge(reservation.status) && (
                  <span
                    className={`${
                      getStatusBadge(reservation.status)!.className
                    } px-2.5 py-0.5 text-xs rounded-full`}
                  >
                    {getStatusBadge(reservation.status)!.label}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] leading-tight">
                {reservation.hotelName}
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                予約番号: {reservation.reservationId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="p-6 border-b border-[var(--bg-tertiary)] bg-[var(--bg-secondary)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
              現在の価格
            </p>
            <p className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
              {formatPrice(reservation.currentPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
              予約時の価格
            </p>
            <p className="text-2xl font-semibold text-[var(--text-secondary)]">
              {formatPrice(reservation.originalPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
              節約額
            </p>
            {priceDrop.amount > 0 ? (
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-emerald-600">
                  {formatPrice(priceDrop.amount)}
                </p>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {priceDrop.percentage}% OFF
                </span>
              </div>
            ) : (
              <p className="text-2xl font-semibold text-[var(--text-tertiary)]">
                ¥0
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 p-2 bg-orange-50 rounded-lg text-orange-500 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                  宿泊日程
                </p>
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  {formatDate(reservation.checkInDate)} 〜{" "}
                  {formatDate(reservation.checkOutDate)}
                </p>
                {daysUntilCheckIn > 0 && (
                  <p className="text-sm text-orange-600 mt-1 font-medium">
                    チェックインまであと{daysUntilCheckIn}日
                  </p>
                )}
              </div>
            </div>

            {reservation.roomType && (
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-blue-50 rounded-lg text-blue-500 shrink-0">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                    プラン
                  </p>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                    {reservation.roomType}
                  </p>
                </div>
              </div>
            )}

            {reservation.guestCount && (
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-indigo-50 rounded-lg text-indigo-500 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                    宿泊人数
                  </p>
                  <p className="text-xs text-[var(--text-primary)]">
                    {reservation.guestCount}名
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 p-2 bg-rose-50 rounded-lg text-rose-500 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                  キャンセル期限
                </p>
                {reservation.cancellationDeadline ? (
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">
                      {formatDate(reservation.cancellationDeadline)}
                    </p>
                    {canCancel ? (
                      <p className="text-sm text-emerald-600 mt-1 font-medium flex items-center gap-1">
                        ✓ 無料キャンセル可能
                      </p>
                    ) : (
                      <p className="text-sm text-rose-600 mt-1 font-medium flex items-center gap-1">
                        ✗ キャンセル料が発生します
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[var(--text-secondary)]">不明</p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <div className="mt-1 p-2 bg-slate-50 rounded-lg text-slate-500 shrink-0">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                  予約登録日
                </p>
                <p className="text-xs text-[var(--text-primary)]">
                  {formatDate(reservation.createdAt)}
                </p>
              </div>
            </div>

            {reservation.hotelUrl && (
              <div className="pt-2">
                <a
                  href={reservation.hotelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  予約ページを開く
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
