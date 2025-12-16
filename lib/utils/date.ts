/**
 * 日付を00:00:00に正規化（時刻部分をリセット）
 */
export function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * 今日の日付を00:00:00に正規化して取得
 */
export function getTodayNormalized(): Date {
  return normalizeDate(new Date());
}

