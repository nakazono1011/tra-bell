import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { reservation } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ReservationList } from "@/components/reservations/reservation-list";
import { SyncGmailButton } from "@/components/reservations/sync-gmail-button";

export default async function ReservationsPage() {
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">予約一覧</h1>
          <p className="text-slate-400 mt-1">すべての予約と価格変動を確認</p>
        </div>
        <SyncGmailButton />
      </div>

      {/* Reservations List */}
      <ReservationList reservations={reservations} />
    </div>
  );
}



