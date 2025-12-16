import { db } from "@/db";
import {
  reservations,
  priceHistory,
  notification,
  userSettings,
} from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import type { PriceCheckResult, ReservationSite } from "@/types";
import { checkRakutenPrice } from "./rakuten";
import { checkJalanPrice } from "./jalan";
import { isBeforeDeadline } from "@/lib/utils";

/**
 * 予約の価格をチェック
 */
export async function checkReservationPrice(reservationData: {
  id: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  reservationSite: ReservationSite;
  currentPrice: number;
  planUrl?: string;
  planName?: string;
  roomType?: string;
}): Promise<PriceCheckResult | null> {
  const {
    id,
    hotelName,
    checkInDate,
    checkOutDate,
    reservationSite,
    currentPrice,
    planUrl,
    planName,
    roomType,
  } = reservationData;

  switch (reservationSite) {
    case "rakuten":
      return checkRakutenPrice(
        hotelName,
        checkInDate,
        checkOutDate,
        id,
        currentPrice,
        planUrl,
        planName,
        roomType
      );
    case "jalan":
      return checkJalanPrice(
        hotelName,
        checkInDate,
        checkOutDate,
        id,
        currentPrice
      );
    default:
      return null;
  }
}

/**
 * ユーザーの閾値設定を取得
 */
async function getUserThresholds(userId: string): Promise<{
  priceDropThreshold: number;
  priceDropPercentage: number;
}> {
  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  return {
    priceDropThreshold: settings?.priceDropThreshold ?? 500,
    priceDropPercentage: settings?.priceDropPercentage ?? 5,
  };
}

/**
 * 価格変動が閾値を超えているかチェック
 */
function isSignificantPriceDrop(
  priceDropAmount: number,
  priceDropPercentage: number,
  thresholds: { priceDropThreshold: number; priceDropPercentage: number }
): boolean {
  return (
    priceDropAmount >= thresholds.priceDropThreshold ||
    priceDropPercentage >= thresholds.priceDropPercentage
  );
}

/**
 * 価格履歴を保存
 */
async function savePriceHistory(
  reservationId: string,
  price: number,
  sourceUrl?: string
): Promise<void> {
  await db.insert(priceHistory).values({
    reservationId,
    price,
    checkedAt: new Date(),
    sourceUrl,
  });
}

/**
 * 予約の現在価格を更新
 */
async function updateReservationPrice(
  reservationId: string,
  newPrice: number
): Promise<void> {
  await db
    .update(reservations)
    .set({ currentPrice: newPrice })
    .where(eq(reservations.id, reservationId));
}

/**
 * 値下がり通知を作成
 */
async function createPriceDropNotification(
  userId: string,
  reservationId: string,
  hotelName: string,
  priceDropAmount: number,
  priceDropPercentage: number
): Promise<void> {
  await db.insert(notification).values({
    userId,
    reservationId,
    type: "price_drop",
    title: `${hotelName}の価格が下がりました`,
    message: `¥${priceDropAmount.toLocaleString()}（${priceDropPercentage.toFixed(
      1
    )}%）値下がりしました。キャンセル・再予約をご検討ください。`,
    isRead: false,
  });
}

/**
 * アクティブな予約を取得
 */
async function getActiveReservations() {
  const today = new Date().toISOString().split("T")[0];
  return await db
    .select()
    .from(reservations)
    .where(
      and(
        eq(reservations.status, "active"),
        gt(reservations.checkInDate, today)
      )
    );
}

/**
 * 単一予約の価格チェックと処理
 */
async function processReservationPriceCheck(reservation: {
  id: string;
  userId: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  reservationSite: ReservationSite;
  currentPrice: number;
  cancellationDeadline: Date | null;
  planUrl?: string | null;
  planName?: string | null;
  roomType?: string | null;
}): Promise<{ checked: boolean; priceDrop: boolean; error: boolean }> {
  // キャンセル期限が過ぎている場合はスキップ
  if (!isBeforeDeadline(reservation.cancellationDeadline)) {
    return { checked: false, priceDrop: false, error: false };
  }

  // 価格をチェック
  const result = await checkReservationPrice({
    id: reservation.id,
    hotelName: reservation.hotelName,
    checkInDate: reservation.checkInDate,
    checkOutDate: reservation.checkOutDate,
    reservationSite: reservation.reservationSite,
    currentPrice: reservation.currentPrice,
    planUrl: reservation.planUrl || undefined,
    planName: reservation.planName || undefined,
    roomType: reservation.roomType || undefined,
  });

  if (!result) {
    return { checked: false, priceDrop: false, error: true };
  }

  // 価格履歴を保存
  await savePriceHistory(reservation.id, result.currentPrice);

  // 価格が変わった場合
  if (result.currentPrice !== reservation.currentPrice) {
    await updateReservationPrice(reservation.id, result.currentPrice);

    // 値下がりの場合、通知を作成
    if (result.priceDropAmount > 0) {
      const thresholds = await getUserThresholds(reservation.userId);

      if (
        isSignificantPriceDrop(
          result.priceDropAmount,
          result.priceDropPercentage,
          thresholds
        )
      ) {
        await createPriceDropNotification(
          reservation.userId,
          reservation.id,
          reservation.hotelName,
          result.priceDropAmount,
          result.priceDropPercentage
        );
        return { checked: true, priceDrop: true, error: false };
      }
    }
  }

  return { checked: true, priceDrop: false, error: false };
}

/**
 * アクティブな予約すべての価格をチェック
 */
export async function checkAllActivePrices(): Promise<{
  checked: number;
  priceDrops: number;
  errors: number;
}> {
  let checked = 0;
  let priceDrops = 0;
  let errors = 0;

  const activeReservations = await getActiveReservations();

  for (const r of activeReservations) {
    try {
      const result = await processReservationPriceCheck({
        id: r.id,
        userId: r.userId,
        hotelName: r.hotelName,
        checkInDate: r.checkInDate,
        checkOutDate: r.checkOutDate,
        reservationSite: r.reservationSite as ReservationSite,
        currentPrice: r.currentPrice,
        cancellationDeadline: r.cancellationDeadline,
        planUrl: r.planUrl,
        planName: r.planName,
        roomType: r.roomType,
      });

      if (result.checked) checked++;
      if (result.priceDrop) priceDrops++;
      if (result.error) errors++;
    } catch (error) {
      console.error(`Error checking price for reservation ${r.id}:`, error);
      errors++;
    }
  }

  return { checked, priceDrops, errors };
}
