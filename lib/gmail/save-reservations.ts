import { db } from '@/db';
import {
  reservations,
  priceHistory,
  userSettings,
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { ParsedEmailResult } from './parser';
import { fetchRakutenAffiliateUrl } from '@/lib/utils/rakuten';

/**
 * 予約をデータベースに保存
 */
export async function saveReservations(
  userId: string,
  results: ParsedEmailResult[]
): Promise<(typeof reservations.$inferSelect)[]> {
  // 既存の予約IDセットを取得（重複チェック用）
  const existingReservations = await db
    .select()
    .from(reservations)
    .where(eq(reservations.userId, userId));

  const existingIds = new Set(
    existingReservations.map(
      (r) => `${r.reservationSite}-${r.reservationId}`
    )
  );

  // 新しい予約を保存
  const newReservations = [];
  for (const result of results) {
    if (!result.reservation) continue;

    const key = `${result.reservation.reservationSite}-${result.reservation.reservationId}`;
    if (existingIds.has(key)) {
      continue; // 既に存在する予約はスキップ
    }

    // 楽天トラベルの場合、アフィリエイトURLを取得
    let affiliateUrl: string | null = null;
    if (
      result.reservation.reservationSite === 'rakuten' &&
      result.reservation.hotelId
    ) {
      try {
        affiliateUrl = await fetchRakutenAffiliateUrl(
          result.reservation.hotelId,
          result.reservation.checkInDate,
          result.reservation.checkOutDate,
          result.reservation.roomCount,
          result.reservation.adultCount,
          result.reservation.childCount
        );
      } catch (error) {
        console.error(
          'Error fetching affiliate URL:',
          error
        );
        // エラーが発生しても予約保存は続行
      }
    }

    // 予約を保存
    const [newReservation] = await db
      .insert(reservations)
      .values({
        userId,
        hotelName: result.reservation.hotelName,
        checkInDate: result.reservation.checkInDate,
        checkOutDate: result.reservation.checkOutDate,
        originalPrice: result.reservation.price,
        currentPrice: result.reservation.price,
        reservationSite: result.reservation.reservationSite,
        reservationId: result.reservation.reservationId,
        cancellationDeadline: result.reservation
          .cancellationDeadline
          ? new Date(
              result.reservation.cancellationDeadline
            )
          : null,
        roomType: result.reservation.roomType,
        adultCount: result.reservation.adultCount,
        childCount: result.reservation.childCount,
        roomCount: result.reservation.roomCount,
        hotelUrl: result.reservation.hotelUrl,
        planName: result.reservation.planName,
        planUrl: result.reservation.planUrl,
        hotelId: result.reservation.hotelId,
        hotelPostalCode: result.reservation.hotelPostalCode,
        hotelAddress: result.reservation.hotelAddress,
        hotelTelNo: result.reservation.hotelTelNo,
        roomThumbnailUrl:
          result.reservation.roomThumbnailUrl,
        emailMessageId: result.messageId,
        affiliateUrl,
        status: 'active',
      })
      .returning();

    // 初期価格履歴を保存
    await db.insert(priceHistory).values({
      reservationId: newReservation.id,
      price: result.reservation.price,
      checkedAt: result.receivedAt,
    });

    newReservations.push(newReservation);
  }

  return newReservations;
}

/**
 * ユーザー設定を更新（Gmail連携済みフラグと最終同期日時）
 */
export async function updateUserSettingsSyncStatus(
  userId: string
) {
  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  if (settings) {
    await db
      .update(userSettings)
      .set({
        gmailConnected: true,
        gmailLastSyncAt: new Date(),
      })
      .where(eq(userSettings.userId, userId));
  } else {
    await db.insert(userSettings).values({
      userId,
      gmailConnected: true,
      gmailLastSyncAt: new Date(),
    });
  }
}
