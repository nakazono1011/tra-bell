import type { ReservationSite, ReservationStatus } from "@/db/schema";

/**
 * 予約サイトのラベルを取得
 */
export function getSiteLabel(site: ReservationSite | string): string {
  switch (site) {
    case "rakuten":
      return "楽天トラベル";
    case "jalan":
      return "じゃらん";
    default:
      return site;
  }
}

/**
 * 予約サイトのバッジカラーを取得
 */
export function getSiteBadgeColor(site: ReservationSite | string): string {
  switch (site) {
    case "rakuten":
      return "bg-red-400/10 text-red-400 border-red-400/20";
    case "jalan":
      return "bg-orange-400/10 text-orange-400 border-orange-400/20";
    default:
      return "bg-[var(--bg-tertiary)]/10 text-[var(--text-secondary)] border-[var(--bg-tertiary)]/20";
  }
}

/**
 * 予約ステータスのバッジを取得
 */
export function getStatusBadge(status: ReservationStatus | string) {
  switch (status) {
    case "active":
      return {
        label: "アクティブ",
        className:
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-400/10 text-emerald-400 border border-emerald-400/20",
      };
    case "cancelled":
      return {
        label: "キャンセル済",
        className:
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-400/10 text-red-400 border border-red-400/20",
      };
    case "rebooked":
      return {
        label: "再予約済",
        className:
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400 border border-blue-400/20",
      };
    default:
      return null;
  }
}
