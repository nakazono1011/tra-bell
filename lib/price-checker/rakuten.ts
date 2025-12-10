import type { PriceCheckResult } from "@/types";

/**
 * 楽天トラベルの価格を取得
 * 注: 実際の実装では楽天トラベルAPIを使用
 */
export async function checkRakutenPrice(
  hotelName: string,
  checkInDate: string,
  checkOutDate: string,
  reservationId: string,
  currentPrice: number
): Promise<PriceCheckResult | null> {
  try {
    // TODO: 楽天トラベルAPIを使用して価格を取得
    // 現在はモック実装
    
    // 楽天トラベルAPI のアプリケーションIDが必要
    // https://webservice.rakuten.co.jp/
    
    const applicationId = process.env.RAKUTEN_APPLICATION_ID;
    
    if (!applicationId) {
      console.log("Rakuten API key not configured");
      // APIキーがない場合は現在価格を返す
      return {
        reservationId,
        previousPrice: currentPrice,
        currentPrice: currentPrice,
        priceDropAmount: 0,
        priceDropPercentage: 0,
        isSignificantDrop: false,
        checkedAt: new Date(),
      };
    }

    // 楽天トラベルAPI呼び出し
    // 注: 実際のAPIエンドポイントとパラメータは楽天APIドキュメントを参照
    // const response = await fetch(
    //   `https://app.rakuten.co.jp/services/api/Travel/VacantHotelSearch/20170426?applicationId=${applicationId}&hotelNo=${hotelId}&checkinDate=${checkInDate}&checkoutDate=${checkOutDate}`
    // );
    // const data = await response.json();
    // const newPrice = extractPrice(data);

    // モック: ランダムに価格変動をシミュレート（実際の実装では削除）
    const priceVariation = Math.random() * 0.1 - 0.05; // -5% から +5%
    const newPrice = Math.round(currentPrice * (1 + priceVariation));

    const priceDropAmount = currentPrice - newPrice;
    const priceDropPercentage = currentPrice > 0 
      ? (priceDropAmount / currentPrice) * 100 
      : 0;
    
    // 500円以上または5%以上の値下がりを重要とみなす
    const isSignificantDrop = priceDropAmount >= 500 || priceDropPercentage >= 5;

    return {
      reservationId,
      previousPrice: currentPrice,
      currentPrice: newPrice,
      priceDropAmount: Math.max(0, priceDropAmount),
      priceDropPercentage: Math.max(0, priceDropPercentage),
      isSignificantDrop: priceDropAmount > 0 && isSignificantDrop,
      checkedAt: new Date(),
    };
  } catch (error) {
    console.error("Error checking Rakuten price:", error);
    return null;
  }
}

/**
 * 楽天トラベルのホテルURLを生成
 */
export function getRakutenHotelUrl(hotelId: string): string {
  return `https://travel.rakuten.co.jp/HOTEL/${hotelId}/`;
}



