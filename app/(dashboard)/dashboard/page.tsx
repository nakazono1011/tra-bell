import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { reservation, notification, userSettings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DashboardStats } from "@/components/dashboard/stats";
import { RecentReservations } from "@/components/dashboard/recent-reservations";
import { RecentNotifications } from "@/components/dashboard/recent-notifications";
import { GmailConnectCard } from "@/components/dashboard/gmail-connect-card";

export default async function DashboardPage() {
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
    .orderBy(desc(reservation.createdAt))
    .limit(5);

  // ユーザーの通知を取得
  const notifications = await db
    .select()
    .from(notification)
    .where(eq(notification.userId, session.user.id))
    .orderBy(desc(notification.createdAt))
    .limit(5);

  // ユーザー設定を取得
  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  // 統計情報を計算
  const allReservations = await db
    .select()
    .from(reservation)
    .where(eq(reservation.userId, session.user.id));

  const activeCount = allReservations.filter(
    (r) => r.status === "active",
  ).length;
  const totalSavings = allReservations.reduce((acc, r) => {
    if (r.originalPrice > r.currentPrice) {
      return acc + (r.originalPrice - r.currentPrice);
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">ダッシュボード</h1>
        <p className="text-slate-400 mt-1">予約状況と価格変動をチェック</p>
      </div>

      {/* Gmail Connect Card (if not connected) */}
      {!settings?.gmailConnected && <GmailConnectCard />}

      {/* Stats */}
      <DashboardStats
        totalReservations={allReservations.length}
        activeReservations={activeCount}
        totalSavings={totalSavings}
        pendingPriceDrops={0} // TODO: 実装
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <RecentReservations reservations={reservations} />

        {/* Recent Notifications */}
        <RecentNotifications notifications={notifications} />
      </div>
    </div>
  );
}
