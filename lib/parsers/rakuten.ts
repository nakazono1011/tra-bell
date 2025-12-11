import type { ParsedReservation } from "@/types";
import type { GmailMessage } from "@/types";
import { GmailClient } from "@/lib/gmail/client";
import { getEmailBody } from "@/lib/utils/parsers";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

/**
 * 楽天トラベルの予約確認メールから情報を抽出するためのスキーマ
 */
const rakutenReservationSchema = z.object({
  reservationId: z.string().describe("予約番号"),
  reservationDate: z
    .string()
    .describe("予約受付日時（ISO 8601形式: YYYY-MM-DDTHH:mm:ss）"),
  checkInDate: z
    .string()
    .describe("チェックイン日時（ISO 8601形式: YYYY-MM-DDTHH:mm:ss）"),
  checkOutDate: z
    .string()
    .describe("チェックアウト日時（ISO 8601形式: YYYY-MM-DDTHH:mm:ss）"),
  representativeName: z.string().optional().describe("代表者氏名"),
  adultCount: z.number().optional().describe("申込人数（大人）"),
  childCount: z.number().optional().describe("申込人数（子供）"),
  roomCount: z.number().optional().describe("申込部屋数"),
  roomType: z.string().optional().describe("部屋タイプ"),
  hotelName: z.string().optional().describe("ホテル名"),
  hotelUrl: z.string().url().optional().describe("ホテルURL"),
  planName: z.string().optional().describe("宿泊プラン名"),
  planUrl: z.string().url().optional().describe("宿泊プランURL"),
  totalPrice: z.number().describe("宿泊合計金額（円）、クーポン差し引き後"),
  paymentMethod: z.string().optional().describe("支払方法"),
  cancellationFeeStartDate: z
    .string()
    .optional()
    .describe("キャンセル料発生開始日（ISO 8601形式: YYYY-MM-DDTHH:mm:ss）"),
});

/**
 * 楽天トラベルの予約確認メールをパース
 */
export async function parseRakutenReservationEmail(
  message: GmailMessage,
): Promise<ParsedReservation | null> {
  try {
    const body = getEmailBody(message);

    if (!body) {
      console.log("No body found in Rakuten email");
      return null;
    }

    // Geminiを使って構造化データを抽出
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: rakutenReservationSchema,
      prompt: `以下の楽天トラベルの予約確認メールから、予約情報を抽出してください。

メール本文:
${body}

以下の情報を抽出してください:
- 予約番号
- 予約受付日時（日付と時刻が分かる場合は時刻も含める、分からない場合は00:00:00とする）
- チェックイン日時（日付と時刻が分かる場合は時刻も含める、分からない場合は00:00:00とする）
- チェックアウト日時（日付と時刻が分かる場合は時刻も含める、分からない場合は00:00:00とする）
- 代表者氏名（見つからない場合は省略）
- 申込人数（大人）（見つからない場合は省略）
- 申込人数（子供）（見つからない場合は省略）
- 申込部屋数（見つからない場合は省略）
- 部屋タイプ（見つからない場合は省略）
- ホテル名（見つからない場合は省略）
- ホテルURL（見つからない場合は省略）
- 宿泊プラン名（見つからない場合は省略）
- 宿泊プランURL（見つからない場合は省略）
- 宿泊合計金額（円単位、カンマは除去、クーポン差し引き後）
- 支払方法（見つからない場合は省略）
- キャンセル料発生開始日（見つからない場合は省略）

日付は必ずISO 8601形式（YYYY-MM-DDTHH:mm:ss）で返してください。`,
    });
    console.log("object", object);

    // 宿泊人数を計算（大人と子供の合計）
    const guestCount =
      (object.adultCount || 0) + (object.childCount || 0) || undefined;

    return {
      hotelName: object.planName || "",
      checkInDate: object.checkInDate,
      checkOutDate: object.checkOutDate,
      price: object.totalPrice,
      reservationId: object.reservationId,
      reservationSite: "rakuten",
      cancellationDeadline: object.cancellationFeeStartDate,
      roomType: object.roomType,
      guestCount,
      hotelUrl: object.planUrl,
    };
  } catch (error) {
    console.error("Error parsing Rakuten reservation email:", error);
    return null;
  }
}

/**
 * 楽天トラベルからのメールかどうかを判定
 */
export function isRakutenEmail(message: GmailMessage): boolean {
  const from = GmailClient.getHeader(message, "From") || "";
  return from.includes("rakuten.co.jp") || from.includes("楽天トラベル");
}
