"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/utils";
import type { Notification } from "@/db/schema";

interface NotificationListProps {
  notifications: Notification[];
}

export function NotificationList({ notifications }: NotificationListProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "price_drop":
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-400/10">
            <svg
              className="w-5 h-5 text-emerald-400"
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
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-400/10">
            <svg
              className="w-5 h-5 text-amber-400"
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
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-400/10">
            <svg
              className="w-5 h-5 text-blue-400"
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
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--bg-secondary)]">
            <svg
              className="w-5 h-5 text-slate-400"
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "price_drop":
        return "価格低下";
      case "auto_cancel":
        return "自動キャンセル";
      case "auto_rebook":
        return "自動再予約";
      default:
        return "お知らせ";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "price_drop":
        return "bg-emerald-400/10 text-emerald-400 border-emerald-400/20";
      case "auto_cancel":
        return "bg-amber-400/10 text-amber-400 border-amber-400/20";
      case "auto_rebook":
        return "bg-blue-400/10 text-blue-400 border-blue-400/20";
      default:
        return "bg-[var(--bg-tertiary)]/10 text-[var(--text-secondary)] border-[var(--bg-tertiary)]/20";
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-[var(--bg-tertiary)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            すべて ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === "unread"
                ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
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
            {filter === "unread"
              ? "未読の通知はありません"
              : "通知はありません"}
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
                  ? "bg-white/30 border-[var(--bg-tertiary)]/50 opacity-70"
                  : "bg-white border-[var(--bg-tertiary)] hover:border-[var(--bg-tertiary)]"
              }`}
            >
              <div className="flex items-start gap-4">
                {getNotificationIcon(n.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-white">
                      {n.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getTypeBadgeColor(
                        n.type
                      )}`}
                    >
                      {getTypeLabel(n.type)}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{n.message}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {formatDateTime(n.createdAt)}
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
