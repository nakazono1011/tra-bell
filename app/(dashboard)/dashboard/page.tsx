import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { reservations, userSettings } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { ReservationList } from '@/components/reservations/reservation-list';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  // ユーザー設定を取得
  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  // ユーザーの予約を取得（全件）
  const reservationsList = await db
    .select()
    .from(reservations)
    .where(eq(reservations.userId, session.user.id))
    .orderBy(desc(reservations.checkInDate));

  return (
    <ReservationList
      reservations={reservationsList}
      isGmailConnected={settings?.gmailConnected ?? false}
    />
  );
}
