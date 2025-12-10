import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { reservation, priceHistory } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { formatPrice, formatDateShort, formatDateTime } from "@/lib/utils";

export default async function PriceHistoryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // ユーザーの予約を取得
  const reservations = await db
    .select()
    .from(reservation)
    .where(eq(reservation.userId, session.user.id))
    .orderBy(desc(reservation.checkInDate));

  // 各予約の最新の価格履歴を取得
  const reservationsWithHistory = await Promise.all(
    reservations.map(async (r) => {
      const history = await db
        .select()
        .from(priceHistory)
        .where(eq(priceHistory.reservationId, r.id))
        .orderBy(desc(priceHistory.checkedAt))
        .limit(10);

      return {
        ...r,
        priceHistory: history,
      };
    })
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">価格履歴</h1>
        <p className="text-slate-400 mt-1">
          予約ごとの価格変動を確認
        </p>
      </div>

      {/* Price History Cards */}
      {reservationsWithHistory.length === 0 ? (
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
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
          <p className="text-slate-400">価格履歴がありません</p>
          <p className="text-slate-500 text-sm mt-1">
            予約を追加すると価格履歴が記録されます
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reservationsWithHistory.map((r) => {
            const priceDiff = r.originalPrice - r.currentPrice;
            const hasHistory = r.priceHistory.length > 0;

            return (
              <div
                key={r.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <Link
                      href={`/dashboard/reservations/${r.id}`}
                      className="text-lg font-semibold text-white hover:text-emerald-400 transition-colors"
                    >
                      {r.hotelName}
                    </Link>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {formatDateShort(r.checkInDate)} 〜 {formatDateShort(r.checkOutDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {formatPrice(r.currentPrice)}
                    </p>
                    {priceDiff > 0 && (
                      <p className="text-sm text-emerald-400">
                        ↓ {formatPrice(priceDiff)} 節約
                      </p>
                    )}
                  </div>
                </div>

                {/* Price History */}
                <div className="p-4">
                  {hasHistory ? (
                    <div className="space-y-2">
                      {r.priceHistory.map((h, i) => {
                        const prevPrice = r.priceHistory[i + 1]?.price;
                        const diff = prevPrice ? h.price - prevPrice : 0;

                        return (
                          <div
                            key={h.id}
                            className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/50"
                          >
                            <span className="text-sm text-slate-400">
                              {formatDateTime(h.checkedAt)}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-white">
                                {formatPrice(h.price)}
                              </span>
                              {diff !== 0 && (
                                <span
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    diff < 0
                                      ? "bg-emerald-400/10 text-emerald-400"
                                      : "bg-red-400/10 text-red-400"
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
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-slate-500">
                        価格履歴はまだありません
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

