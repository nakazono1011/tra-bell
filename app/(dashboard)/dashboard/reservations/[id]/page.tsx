import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { db } from "@/db";
import { reservation, priceHistory } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import Link from "next/link";
import { ReservationDetail } from "@/components/reservations/reservation-detail";
import { PriceHistoryChart } from "@/components/reservations/price-history-chart";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReservationDetailPage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { id } = await params;

  // 予約を取得（ユーザー所有確認付き）
  const [reservationData] = await db
    .select()
    .from(reservation)
    .where(
      and(
        eq(reservation.id, id),
        eq(reservation.userId, session.user.id)
      )
    )
    .limit(1);

  if (!reservationData) {
    notFound();
  }

  // 価格履歴を取得
  const priceHistoryData = await db
    .select()
    .from(priceHistory)
    .where(eq(priceHistory.reservationId, id))
    .orderBy(desc(priceHistory.checkedAt));

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/dashboard/reservations"
          className="text-slate-400 hover:text-white transition-colors"
        >
          予約一覧
        </Link>
        <span className="text-slate-600">/</span>
        <span className="text-white">{reservationData.hotelName}</span>
      </div>

      {/* Reservation Detail */}
      <ReservationDetail reservation={reservationData} />

      {/* Price History Chart */}
      <PriceHistoryChart
        priceHistory={priceHistoryData}
        originalPrice={reservationData.originalPrice}
      />
    </div>
  );
}



