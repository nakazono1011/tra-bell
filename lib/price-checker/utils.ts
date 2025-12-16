import type { PriceCheckResult } from "@/types";

/**
 * 価格チェック結果を生成する共通ヘルパー
 */
export function createPriceCheckResult(
  reservationId: string,
  previousPrice: number,
  currentPrice: number
): PriceCheckResult {
  const priceDropAmount = previousPrice - currentPrice;
  const priceDropPercentage =
    previousPrice > 0 ? (priceDropAmount / previousPrice) * 100 : 0;
  const isSignificantDrop =
    priceDropAmount >= 500 || priceDropPercentage >= 5;

  return {
    reservationId,
    previousPrice,
    currentPrice,
    priceDropAmount: Math.max(0, priceDropAmount),
    priceDropPercentage: Math.max(0, priceDropPercentage),
    isSignificantDrop: priceDropAmount > 0 && isSignificantDrop,
    checkedAt: new Date(),
  };
}

/**
 * エラー時または価格が見つからない場合のデフォルト結果を返す
 */
export function createDefaultPriceResult(
  reservationId: string,
  currentPrice: number
): PriceCheckResult {
  return createPriceCheckResult(reservationId, currentPrice, currentPrice);
}

