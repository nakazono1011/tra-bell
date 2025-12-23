import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export reservation utilities
export * from './utils/reservation';

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(price);
}

export function formatDate(date: Date | string): string {
  const d =
    typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateShort(
  date: Date | string
): string {
  const d =
    typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(
  date: Date | string
): string {
  const d =
    typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function calculatePriceDrop(
  originalPrice: number,
  currentPrice: number
): {
  amount: number;
  percentage: number;
} {
  const amount = originalPrice - currentPrice;
  const percentage =
    originalPrice > 0 ? (amount / originalPrice) * 100 : 0;
  return { amount, percentage: Math.round(percentage) };
}

export function getDaysUntil(date: Date | string): number {
  const target =
    typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isBeforeDeadline(
  deadline: Date | string | null
): boolean {
  if (!deadline) return true;
  const d =
    typeof deadline === 'string'
      ? new Date(deadline)
      : deadline;
  return new Date() < d;
}

/**
 * キャンセル発生日をyyyy/mm/dd形式でフォーマット
 */
export function formatCancellationDate(
  deadline: Date | string | null
): string | null {
  if (!deadline) return null;
  const date =
    deadline instanceof Date
      ? deadline
      : new Date(deadline);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    '0'
  );
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * 宿泊日数を計算（チェックイン日からチェックアウト日まで）
 */
export function calculateNights(
  checkInDate: Date | string,
  checkOutDate: Date | string
): number {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
