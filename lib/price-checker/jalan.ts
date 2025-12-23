import type { PriceCheckResult } from '@/types';
import { createPriceCheckResult } from './utils';

/**
 * じゃらんの価格を取得
 * 注: じゃらんには公式APIがないため、スクレイピングまたは別の方法が必要
 */
export async function checkJalanPrice(
  hotelName: string,
  checkInDate: string,
  checkOutDate: string,
  reservationId: string,
  currentPrice: number
): Promise<PriceCheckResult | null> {
  try {
    // TODO: じゃらんの価格を取得する方法を実装
    // オプション:
    // 1. Webスクレイピング（利用規約要確認）
    // 2. 非公式API（存在する場合）
    // 3. ブラウザ自動化（Puppeteer/Playwright）

    // 現在はモック実装
    // モック: ランダムに価格変動をシミュレート（実際の実装では削除）
    const priceVariation = Math.random() * 0.1 - 0.05; // -5% から +5%
    const newPrice = Math.round(
      currentPrice * (1 + priceVariation)
    );

    return createPriceCheckResult(
      reservationId,
      currentPrice,
      newPrice
    );
  } catch (error) {
    console.error('Error checking Jalan price:', error);
    return null;
  }
}

/**
 * じゃらんのホテルURLを生成
 */
export function getJalanHotelUrl(hotelId: string): string {
  return `https://www.jalan.net/yad${hotelId}/`;
}
