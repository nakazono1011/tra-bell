'use client';

import { useState } from 'react';
import { formatDateTime } from '@/lib/utils';
import type {
  Notification,
  NotificationType,
} from '@/db/schema';

interface NotificationListProps {
  notifications: Notification[];
}

type NotificationConfig = {
  label: string;
  badgeColor: string;
  iconBg: string;
  iconColor: string;
  iconPath: string;
};

const NOTIFICATION_CONFIGS: Record<
  NotificationType,
  NotificationConfig
> = {
  price_drop: {
    label: '価格低下',
    badgeColor:
      'bg-emerald-50 text-emerald-600 border-emerald-200',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    iconPath: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6',
  },
  auto_cancel: {
    label: '自動キャンセル',
    badgeColor:
      'bg-amber-50 text-amber-600 border-amber-200',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    iconPath:
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  },
  auto_rebook: {
    label: '自動再予約',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-200',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    iconPath:
      'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  },
  info: {
    label: 'お知らせ',
    badgeColor: 'bg-gray-50 text-gray-600 border-gray-200',
    iconBg: 'bg-[var(--bg-secondary)]',
    iconColor: 'text-slate-400',
    iconPath:
      'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
};

function NotificationIcon({
  type,
}: {
  type: NotificationType;
}) {
  const config = NOTIFICATION_CONFIGS[type];
  return (
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-full ${config.iconBg}`}
    >
      <svg
        className={`w-5 h-5 ${config.iconColor}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={config.iconPath}
        />
      </svg>
    </div>
  );
}

export function NotificationList({
  notifications,
}: NotificationListProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>(
    'all'
  );

  const filteredNotifications = notifications.filter(
    (n) => {
      if (filter === 'unread') return !n.isRead;
      return true;
    }
  );

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(
        'Failed to mark notification as read:',
        error
      );
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            すべて ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            未読 ({unreadCount})
          </button>
        </div>
      </div>

      {/* Notification Cards */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-secondary)] mb-4">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <p className="text-slate-400">
            {filter === 'unread'
              ? '未読の通知はありません'
              : '通知はありません'}
          </p>
          <p className="text-slate-500 text-sm mt-1">
            価格変動や自動処理の結果がここに表示されます
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && markAsRead(n.id)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                n.isRead
                  ? 'bg-white border-gray-200 opacity-70'
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <NotificationIcon type={n.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {formatDateTime(n.createdAt)}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        NOTIFICATION_CONFIGS[n.type]
                          .badgeColor
                      }`}
                    >
                      {NOTIFICATION_CONFIGS[n.type].label}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1">
                    {n.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {n.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
