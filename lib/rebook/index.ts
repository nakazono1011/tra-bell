import { db } from "@/db";
import { reservations, notification, userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Reservation, ReservationSite } from "@/types";
import { isBeforeDeadline, formatPrice } from "@/lib/utils";

export interface RebookResult {
  success: boolean;
  action: "cancelled" | "rebooked" | "skipped";
  message: string;
  newReservationId?: string;
  savings?: number;
}

/**
 * 自動再予約処理を実行
 */
export async function processAutoRebook(
  reservationData: Reservation,
  newPrice: number
): Promise<RebookResult> {
  // キャンセル期限チェック
  if (!isBeforeDeadline(reservationData.cancellationDeadline)) {
    return {
      success: false,
      action: "skipped",
      message: "キャンセル期限を過ぎています",
    };
  }

  // ユーザー設定を取得
  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, reservationData.userId))
    .limit(1);

  // 自動再予約が無効の場合はスキップ
  if (!settings?.autoRebookEnabled) {
    return {
      success: false,
      action: "skipped",
      message: "自動再予約が無効です",
    };
  }

  // 価格差を計算
  const priceDrop = reservationData.currentPrice - newPrice;
  if (priceDrop <= 0) {
    return {
      success: false,
      action: "skipped",
      message: "価格が下がっていません",
    };
  }

  try {
    // 1. 現在の予約をキャンセル
    const cancelResult = await cancelReservation(
      reservationData.reservationSite as ReservationSite,
      reservationData.reservationId
    );

    if (!cancelResult.success) {
      // キャンセル失敗
      await createNotification(
        reservationData.userId,
        reservationData.id,
        "auto_cancel",
        "自動キャンセルに失敗しました",
        `${reservationData.hotelName}の自動キャンセルに失敗しました: ${cancelResult.message}`
      );

      return {
        success: false,
        action: "skipped",
        message: cancelResult.message,
      };
    }

    // 2. 新しい予約を作成
    const rebookResult = await createNewReservation(
      reservationData.reservationSite as ReservationSite,
      {
        hotelName: reservationData.hotelName,
        checkInDate: reservationData.checkInDate,
        checkOutDate: reservationData.checkOutDate,
        roomType: reservationData.roomType,
        adultCount: reservationData.adultCount,
        childCount: reservationData.childCount,
      },
      newPrice
    );

    if (!rebookResult.success) {
      // 再予約失敗（キャンセルは成功）
      await db
        .update(reservations)
        .set({ status: "cancelled" })
        .where(eq(reservations.id, reservationData.id));

      await createNotification(
        reservationData.userId,
        reservationData.id,
        "auto_cancel",
        "予約がキャンセルされました",
        `${reservationData.hotelName}の予約がキャンセルされましたが、再予約に失敗しました。手動で再予約してください。`
      );

      return {
        success: false,
        action: "cancelled",
        message: "キャンセルは成功しましたが、再予約に失敗しました",
      };
    }

    // 3. 予約ステータスを更新
    await db
      .update(reservations)
      .set({
        status: "rebooked",
        currentPrice: newPrice,
      })
      .where(eq(reservations.id, reservationData.id));

    // 4. 新しい予約をDBに追加
    const [newReservation] = await db
      .insert(reservations)
      .values({
        userId: reservationData.userId,
        hotelName: reservationData.hotelName,
        checkInDate: reservationData.checkInDate,
        checkOutDate: reservationData.checkOutDate,
        originalPrice: newPrice,
        currentPrice: newPrice,
        reservationSite: reservationData.reservationSite,
        reservationId: rebookResult.newReservationId!,
        cancellationDeadline: reservationData.cancellationDeadline,
        roomType: reservationData.roomType,
        adultCount: reservationData.adultCount,
        childCount: reservationData.childCount,
        roomCount: reservationData.roomCount,
        hotelUrl: reservationData.hotelUrl,
        planName: reservationData.planName,
        planUrl: reservationData.planUrl,
        hotelId: reservationData.hotelId,
        hotelPostalCode: reservationData.hotelPostalCode,
        hotelAddress: reservationData.hotelAddress,
        hotelTelNo: reservationData.hotelTelNo,
        status: "active",
      })
      .returning();

    // 5. 成功通知を作成
    await createNotification(
      reservationData.userId,
      newReservation.id,
      "auto_rebook",
      "自動再予約が完了しました",
      `${reservationData.hotelName}を${formatPrice(
        priceDrop
      )}安く再予約しました！`
    );

    return {
      success: true,
      action: "rebooked",
      message: "自動再予約が完了しました",
      newReservationId: rebookResult.newReservationId,
      savings: priceDrop,
    };
  } catch (error) {
    console.error("Auto rebook error:", error);
    return {
      success: false,
      action: "skipped",
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * 予約をキャンセル（サイト別実装）
 */
async function cancelReservation(
  site: ReservationSite,
  reservationId: string
): Promise<{ success: boolean; message: string }> {
  // TODO: 実際のキャンセル処理を実装
  // 各サイトのAPIまたはブラウザ自動化を使用

  console.log(`Cancelling ${site} reservation: ${reservationId}`);

  // モック実装: 常に成功を返す
  // 実際の実装では:
  // - 楽天トラベル: マイページAPIまたはブラウザ自動化
  // - じゃらん: マイページAPIまたはブラウザ自動化

  return {
    success: true,
    message: "キャンセル処理が完了しました（モック）",
  };
}

/**
 * 新しい予約を作成（サイト別実装）
 */
async function createNewReservation(
  site: ReservationSite,
  reservationDetails: {
    hotelName: string;
    checkInDate: string;
    checkOutDate: string;
    roomType?: string | null;
    adultCount?: number | null;
    childCount?: number | null;
  },
  price: number
): Promise<{ success: boolean; newReservationId?: string; message: string }> {
  // TODO: 実際の予約処理を実装
  // 各サイトのAPIまたはブラウザ自動化を使用

  console.log(`Creating new ${site} reservation:`, reservationDetails, price);

  // モック実装: 新しい予約番号を生成して返す
  const newReservationId = `AUTO-${Date.now()}`;

  return {
    success: true,
    newReservationId,
    message: "再予約処理が完了しました（モック）",
  };
}

/**
 * 通知を作成
 */
async function createNotification(
  userId: string,
  reservationId: string,
  type: "price_drop" | "auto_cancel" | "auto_rebook" | "info",
  title: string,
  message: string
): Promise<void> {
  await db.insert(notification).values({
    userId,
    reservationId,
    type,
    title,
    message,
    isRead: false,
  });
}

/**
 * 値下がりを検知して自動再予約を判断
 */
export async function evaluateAndRebook(
  reservationData: Reservation,
  newPrice: number
): Promise<RebookResult | null> {
  // ユーザー設定を取得
  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, reservationData.userId))
    .limit(1);

  if (!settings) {
    return null;
  }

  const priceDrop = reservationData.currentPrice - newPrice;
  const priceDropPercentage = (priceDrop / reservationData.currentPrice) * 100;

  // 閾値チェック
  const meetsThreshold =
    priceDrop >= (settings.priceDropThreshold ?? 500) ||
    priceDropPercentage >= (settings.priceDropPercentage ?? 5);

  if (!meetsThreshold) {
    return null;
  }

  // 自動再予約が有効な場合のみ実行
  if (settings.autoRebookEnabled) {
    return processAutoRebook(reservationData, newPrice);
  }

  // 自動再予約が無効でも通知は送信
  await createNotification(
    reservationData.userId,
    reservationData.id,
    "price_drop",
    `${reservationData.hotelName}の価格が下がりました`,
    `${formatPrice(priceDrop)}（${priceDropPercentage.toFixed(
      1
    )}%）値下がりしました。キャンセル・再予約をご検討ください。`
  );

  return {
    success: true,
    action: "skipped",
    message: "価格低下を通知しました（自動再予約は無効）",
  };
}
