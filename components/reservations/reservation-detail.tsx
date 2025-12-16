"use client";

import {
  formatPrice,
  formatDate,
  calculatePriceDrop,
  isBeforeDeadline,
} from "@/lib/utils";
import {
  getSiteLabel,
  getSiteBadgeColor,
  getStatusBadge,
  formatGuestCount,
} from "@/lib/utils/reservation";
import type { Reservation } from "@/db/schema";
import {
  Calendar,
  Users,
  Bed,
  Clock,
  ExternalLink,
  CalendarClock,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";

interface ReservationDetailProps {
  reservation: Reservation;
}

export function ReservationDetail({ reservation }: ReservationDetailProps) {
  const priceDrop = calculatePriceDrop(
    reservation.originalPrice,
    reservation.currentPrice
  );
  const canCancel = isBeforeDeadline(reservation.cancellationDeadline);

  return (
    <div className="rounded-2xl border border-[var(--bg-tertiary)] bg-white overflow-hidden shadow-sm">
      {/* Hotel Thumbnail Image */}
      {reservation.roomThumbnailUrl && (
        <div className="w-full h-64 aspect-square relative bg-[var(--bg-secondary)]">
          <Image
            src={reservation.roomThumbnailUrl}
            alt={reservation.hotelName}
            fill
          />
        </div>
      )}

      <div className="py-4 px-6 border-b border-[var(--bg-tertiary)] bg-white">
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
              <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-tight">
                {reservation.hotelName}
              </h1>
              {reservation.planName && (
                <p className="text-xs mt-2 text-[var(--text-primary)] leading-relaxed">
                  {reservation.planName}
                </p>
              )}
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                予約番号: {reservation.reservationId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="px-6 py-4 border-b border-[var(--bg-tertiary)] bg-[var(--bg-secondary)]">
        <div className="grid grid-cols-3 gap-4 md:gap-4 lg:gap-8 items-end">
          <div>
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              現在の価格
            </p>
            <p className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              {formatPrice(reservation.currentPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
              予約時の価格
            </p>
            <p className="text-xl font-semibold text-[var(--text-secondary)]">
              {formatPrice(reservation.originalPrice)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-medium text-[var(--text-secondary)]">
                節約額
              </p>
              {priceDrop.amount > 0 && (
                <span className="text-xs text-emerald-600">
                  {priceDrop.percentage}% OFF
                </span>
              )}
            </div>
            {priceDrop.amount > 0 ? (
              <p className="text-xl font-bold text-emerald-600">
                {formatPrice(priceDrop.amount)}
              </p>
            ) : (
              <p className="text-xl font-semibold text-[var(--text-tertiary)]">
                ¥0
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 p-2 bg-orange-50 rounded-lg text-orange-500 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                  宿泊日程
                </p>
                <p className="text-xs font-semibold text-[var(--text-primary)]">
                  {formatDate(reservation.checkInDate)} 〜{" "}
                  {formatDate(reservation.checkOutDate)}
                </p>
              </div>
            </div>

            {reservation.roomType && (
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-purple-50 rounded-lg text-purple-500 shrink-0">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                    部屋タイプ
                  </p>
                  <p className="text-xs text-[var(--text-primary)] leading-normal">
                    {reservation.roomType}
                  </p>
                </div>
              </div>
            )}

            {reservation.roomCount && (
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-cyan-50 rounded-lg text-cyan-500 shrink-0">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                    部屋数
                  </p>
                  <p className="text-xs text-[var(--text-primary)]">
                    {reservation.roomCount}室
                  </p>
                </div>
              </div>
            )}

            {(reservation.adultCount || reservation.childCount) && (
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-indigo-50 rounded-lg text-indigo-500 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                    宿泊人数
                  </p>
                  <p className="text-xs text-[var(--text-primary)]">
                    {formatGuestCount(
                      reservation.adultCount,
                      reservation.childCount
                    )}
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
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                  キャンセル期限
                </p>
                {reservation.cancellationDeadline ? (
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">
                      {formatDate(reservation.cancellationDeadline)}
                    </p>
                    {canCancel ? (
                      <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                        ✓ 無料キャンセル可能
                      </p>
                    ) : (
                      <p className="text-xs text-rose-600 mt-1 font-medium flex items-center gap-1">
                        ✗ キャンセル料発生
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
                <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                  予約登録日
                </p>
                <p className="text-xs text-[var(--text-primary)]">
                  {formatDate(reservation.createdAt)}
                </p>
              </div>
            </div>

            {(reservation.hotelPostalCode || reservation.hotelAddress) && (
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-green-50 rounded-lg text-green-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                    ホテル住所
                  </p>
                  {reservation.hotelPostalCode && (
                    <p className="text-xs text-[var(--text-primary)]">
                      〒{reservation.hotelPostalCode}
                    </p>
                  )}
                  {reservation.hotelAddress && (
                    <p className="text-xs text-[var(--text-primary)] mt-1">
                      {reservation.hotelAddress}
                    </p>
                  )}
                </div>
              </div>
            )}

            {reservation.hotelTelNo && (
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-teal-50 rounded-lg text-teal-500 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--text-secondary)] mb-1">
                    ホテル電話番号
                  </p>
                  <p className="text-xs text-[var(--text-primary)]">
                    {reservation.hotelTelNo}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {reservation.hotelUrl && (
          <div className="w-full pt-2">
            <a
              href={reservation.hotelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors text-xs font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              予約ページを開く
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
