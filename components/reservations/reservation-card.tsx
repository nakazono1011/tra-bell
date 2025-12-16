"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatPrice, formatDateShort } from "@/lib/utils";
import type { Reservation } from "@/db/schema";

interface ReservationCardProps {
  reservation: Reservation;
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  const [imageError, setImageError] = useState(false);

  // ホテルサムネイル画像のURL
  // 実際の実装では、hotelUrlから画像を取得するか、ホテル画像APIを使用
  // 現時点ではプレースホルダー画像を使用
  const thumbnailUrl = imageError
    ? "/images/hotel-placeholder.jpg"
    : reservation.hotelUrl || "/images/hotel-placeholder.jpg";

  // プラン名（planNameを優先、なければroomTypeを使用）
  const planName = reservation.planName || reservation.roomType || "";

  // キャンセル発生日のフォーマット（yyyy/mm/dd形式）
  const cancellationDate = reservation.cancellationDeadline
    ? (() => {
        const date =
          reservation.cancellationDeadline instanceof Date
            ? reservation.cancellationDeadline
            : new Date(reservation.cancellationDeadline);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}/${month}/${day}`;
      })()
    : null;

  return (
    <Link
      href={`/dashboard/reservations/${reservation.id}`}
      className="block bg-white border-b border-[var(--bg-tertiary)] transition-all duration-200 hover:bg-[var(--bg-secondary)]"
    >
      <div className="flex gap-4 p-4 relative">
        {/* Left: Hotel Thumbnail */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-[var(--bg-secondary)]">
          {!imageError ? (
            <Image
              src={thumbnailUrl}
              alt={reservation.hotelName}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--bg-secondary)]">
              <svg
                className="w-8 h-8 text-[var(--text-tertiary)]"
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
          )}
        </div>

        {/* Right: Reservation Details */}
        <div className="flex-1 min-w-0 flex flex-col gap-1 pr-20">
          {/* Hotel Name */}
          <h3 className="text-base font-semibold text-[var(--text-primary)] truncate">
            {reservation.hotelName}
          </h3>

          {/* Plan Name */}
          {planName && (
            <p className="text-xs text-[var(--text-secondary)] truncate w-full">
              {planName}
            </p>
          )}

          {/* Check-in ~ Check-out Date */}
          <p className="text-xs text-[var(--text-secondary)]">
            {formatDateShort(reservation.checkInDate)} ~{" "}
            {formatDateShort(reservation.checkOutDate)}
          </p>

          {/* Cancellation Date */}
          {cancellationDate && (
            <p className="text-xs text-[var(--text-secondary)]">
              {cancellationDate} にキャンセル料発生
            </p>
          )}
        </div>

        {/* Current Price - Bottom Right */}
        <div className="absolute bottom-4 right-4">
          <p className="text-lg font-bold text-[var(--text-primary)]">
            {formatPrice(reservation.currentPrice)}
          </p>
        </div>
      </div>
    </Link>
  );
}
