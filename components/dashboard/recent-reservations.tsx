import Link from "next/link";
import { formatPrice, formatDateShort, calculatePriceDrop } from "@/lib/utils";
import { getSiteLabel, getStatusBadge } from "@/lib/utils/reservation";
import type { Reservation } from "@/db/schema";

interface RecentReservationsProps {
  reservations: Reservation[];
}

export function RecentReservations({ reservations }: RecentReservationsProps) {

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-white">最近の予約</h2>
        <Link
          href="/dashboard/reservations"
          className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          すべて表示 →
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="p-6 text-center">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">予約がありません</p>
          <p className="text-slate-500 text-xs mt-1">
            Gmailから予約を取得するか、手動で追加してください
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800">
          {reservations.map((reservation) => {
            const priceDrop = calculatePriceDrop(
              reservation.originalPrice,
              reservation.currentPrice
            );
            const hasDrop = priceDrop.amount > 0;

            return (
              <Link
                key={reservation.id}
                href={`/dashboard/reservations/${reservation.id}`}
                className="block p-4 hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white truncate">
                        {reservation.hotelName}
                      </h3>
                      {getStatusBadge(reservation.status) && (
                        <span
                          className={getStatusBadge(reservation.status)!.className}
                        >
                          {getStatusBadge(reservation.status)!.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDateShort(reservation.checkInDate)} 〜{" "}
                      {formatDateShort(reservation.checkOutDate)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {getSiteLabel(reservation.reservationSite)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      {formatPrice(reservation.currentPrice)}
                    </p>
                    {hasDrop && (
                      <p className="text-xs text-emerald-400 mt-0.5">
                        ↓ {formatPrice(priceDrop.amount)} ({priceDrop.percentage}%)
                      </p>
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

