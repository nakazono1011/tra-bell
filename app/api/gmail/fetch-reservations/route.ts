import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GmailClient } from "@/lib/gmail/client";
import {
  parseReservationEmails,
  filterValidReservations,
  deduplicateReservations,
} from "@/lib/gmail/parser";
import {
  saveReservations,
  updateUserSettingsSyncStatus,
} from "@/lib/gmail/save-reservations";

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
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const afterDate = settings?.gmailLastSyncAt || sixtyDaysAgo;

    // Gmailから予約確認メールを検索
    const messages = await gmailClient.searchReservationEmails(50, afterDate);

    // メールをパース
    const parsedResults = await parseReservationEmails(messages);
    const validResults = filterValidReservations(parsedResults);
    const uniqueResults = deduplicateReservations(validResults);

    // 予約を保存
    const newReservations = await saveReservations(userId, uniqueResults);

    // ユーザー設定を更新（Gmail連携済みフラグと最終同期日時）
    await updateUserSettingsSyncStatus(userId);

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
