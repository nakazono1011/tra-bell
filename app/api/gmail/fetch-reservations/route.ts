import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { reservation, userSettings, priceHistory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GmailClient } from "@/lib/gmail/client";
import {
  parseReservationEmails,
  filterValidReservations,
  deduplicateReservations,
} from "@/lib/gmail/parser";

export async function GET() {
  try {
    // 認証チェック
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Gmailクライアントを取得
    const gmailClient = await GmailClient.fromUserId(userId);

    if (!gmailClient) {
      return NextResponse.json(
        { success: false, error: "Gmail not connected" },
        { status: 400 }
      );
    }

    // ユーザー設定を取得（最終同期日時を取得）
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    // 過去60日分のメールを取得
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 60);
    const afterDate = settings?.gmailLastSyncAt || thirtyDaysAgo;

    // Gmailから予約確認メールを検索
    const messages = await gmailClient.searchReservationEmails(50, afterDate);
    console.log("messages", messages);

    // メールをパース
    const parsedResults = await parseReservationEmails(messages);
    const validResults = filterValidReservations(parsedResults);
    const uniqueResults = deduplicateReservations(validResults);

    // 既存の予約IDセットを取得（重複チェック用）
    const existingReservations = await db
      .select()
      .from(reservation)
      .where(eq(reservation.userId, userId));

    const existingIds = new Set(
      existingReservations.map((r) => `${r.reservationSite}-${r.reservationId}`)
    );

    // 新しい予約を保存
    const newReservations = [];
    for (const result of uniqueResults) {
      if (!result.reservation) continue;

      const key = `${result.reservation.reservationSite}-${result.reservation.reservationId}`;
      if (existingIds.has(key)) {
        continue; // 既に存在する予約はスキップ
      }

      // 予約を保存
      const [newReservation] = await db
        .insert(reservation)
        .values({
          userId,
          hotelName: result.reservation.hotelName,
          checkInDate: result.reservation.checkInDate,
          checkOutDate: result.reservation.checkOutDate,
          originalPrice: result.reservation.price,
          currentPrice: result.reservation.price,
          reservationSite: result.reservation.reservationSite,
          reservationId: result.reservation.reservationId,
          cancellationDeadline: result.reservation.cancellationDeadline
            ? new Date(result.reservation.cancellationDeadline)
            : null,
          roomType: result.reservation.roomType,
          guestCount: result.reservation.guestCount,
          hotelUrl: result.reservation.hotelUrl,
          emailMessageId: result.messageId,
          status: "active",
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

    // ユーザー設定を更新（Gmail連携済みフラグと最終同期日時）
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

    return NextResponse.json({
      success: true,
      data: {
        totalMessagesFound: messages.length,
        validReservationsFound: validResults.length,
        newReservationsSaved: newReservations.length,
        reservations: newReservations,
      },
    });
  } catch (error) {
    console.error("Error fetching Gmail reservations:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  // POSTでも同じ処理を実行
  return GET();
}
