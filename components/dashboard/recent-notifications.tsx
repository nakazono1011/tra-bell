import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import type { Notification } from "@/db/schema";

interface RecentNotificationsProps {
  notifications: Notification[];
}

export function RecentNotifications({ notifications }: RecentNotificationsProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "price_drop":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-400/10">
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          </div>
        );
      case "auto_cancel":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-400/10">
            <svg
              className="w-4 h-4 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        );
      case "auto_rebook":
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-400/10">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-white">最近の通知</h2>
        <Link
          href="/dashboard/notifications"
          className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          すべて表示 →
        </Link>
      </div>

      {notifications.length === 0 ? (
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">通知はありません</p>
          <p className="text-slate-500 text-xs mt-1">
            価格変動や自動処理の結果がここに表示されます
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 ${
                notification.isRead ? "opacity-60" : ""
              } hover:bg-slate-800/50 transition-colors`}
            >
              <div className="flex items-start gap-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white">
                    {notification.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {formatDateTime(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



