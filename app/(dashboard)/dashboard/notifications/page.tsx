import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { notification } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { NotificationList } from '@/components/notifications/notification-list';

export default async function NotificationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  // ユーザーの通知を取得
  const notifications = await db
    .select()
    .from(notification)
    .where(eq(notification.userId, session.user.id))
    .orderBy(desc(notification.createdAt));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          通知
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          価格変動の通知を確認
        </p>
      </div>

      {/* Notifications List */}
      <NotificationList notifications={notifications} />
    </div>
  );
}
