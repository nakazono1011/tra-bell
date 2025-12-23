import type { ParsedReservation } from '@/types';
import type { GmailMessage } from '@/types';
import { GmailClient } from '@/lib/gmail/client';
import { getEmailBody } from '@/lib/utils/parsers';
import {
  extractHotelIdFromRakutenUrl,
  buildRakutenPlanUrl,
  addQueryParamsToRakutenPlanUrl,
  fetchRakutenRoomThumbnailUrl,
} from '@/lib/utils/rakuten';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

/**
 * 楽天トラベルの予約確認メールから情報を抽出するためのスキーマ
 */
const rakutenReservationSchema = z.object({
  reservationId: z.string().describe('予約番号'),
  reservationDate: z
    .string()
    .describe(
      '予約受付日時（ISO 8601形式: YYYY-MM-DDTHH:mm:ss）'
    ),
  checkInDate: z
    .string()
    .describe(
      'チェックイン日時（ISO 8601形式: YYYY-MM-DDTHH:mm:ss）'
    ),
  checkOutDate: z
    .string()
    .describe(
      'チェックアウト日時（ISO 8601形式: YYYY-MM-DDTHH:mm:ss）'
    ),
  representativeName: z
    .string()
    .optional()
    .describe('代表者氏名'),
  adultCount: z
    .number()
    .optional()
    .describe('申込人数（大人）'),
  childCount: z
    .number()
    .optional()
    .describe('申込人数（子供）'),
  roomCount: z.number().optional().describe('申込部屋数'),
  roomType: z.string().optional().describe('部屋タイプ'),
  hotelName: z.string().optional().describe('ホテル名'),
  hotelUrl: z
    .string()
    .url()
    .optional()
    .describe('ホテルURL'),
  planName: z.string().optional().describe('宿泊プラン名'),
  planUrl: z
    .string()
    .url()
    .optional()
    .describe('宿泊プランURL'),
  hotelId: z
    .string()
    .optional()
    .describe(
      'ホテルID（URLから抽出、hotelinfo/plan/{数字}の形式）'
    ),
  hotelPostalCode: z
    .string()
    .optional()
    .describe('ホテル郵便番号'),
  hotelAddress: z
    .string()
    .optional()
    .describe('ホテル住所'),
  hotelTelNo: z
    .string()
    .optional()
    .describe('ホテル電話番号'),
  totalPrice: z
    .number()
    .describe('宿泊合計金額（円）、クーポン差し引き後'),
  paymentMethod: z.string().optional().describe('支払方法'),
  cancellationFeeStartDate: z
    .string()
    .optional()
    .describe(
      'キャンセル料発生開始日（ISO 8601形式: YYYY-MM-DDTHH:mm:ss）'
    ),
});

/**
 * 楽天トラベルの予約確認メールをパース
 */
export async function parseRakutenReservationEmail(
  message: GmailMessage
): Promise<ParsedReservation | null> {
  try {
    const body = getEmailBody(message);

    if (!body) {
      console.log('No body found in Rakuten email');
      return null;
    }

    // Geminiを使って構造化データを抽出
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
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
- ホテルID（URLから抽出、hotelinfo/plan/{数字}の形式、見つからない場合は省略）
- ホテル郵便番号（見つからない場合は省略）
- ホテル住所（見つからない場合は省略）
- ホテル電話番号（見つからない場合は省略）
- 宿泊合計金額（円単位、カンマは除去、クーポン差し引き後）
- 支払方法（見つからない場合は省略）
- キャンセル料発生開始日（見つからない場合は省略）

日付は必ずISO 8601形式（YYYY-MM-DDTHH:mm:ss）で返してください。`,
    });
    console.log('object', object);

    // hotelIdを抽出（スキーマから取得、またはplanUrlから抽出）
    const hotelId =
      object.hotelId ||
      (object.planUrl
        ? extractHotelIdFromRakutenUrl(object.planUrl)
        : null);

    // planUrlを構築または更新
    const planUrl = hotelId
      ? buildRakutenPlanUrl(
          hotelId,
          object.checkInDate,
          object.checkOutDate,
          object.roomCount,
          object.adultCount,
          object.childCount
        )
      : object.planUrl
        ? addQueryParamsToRakutenPlanUrl(
            object.planUrl,
            object.checkInDate,
            object.checkOutDate,
            object.roomCount,
            object.adultCount,
            object.childCount
          )
        : undefined;

    // 施設IDからroomThumbnailUrlを取得
    let roomThumbnailUrl: string | undefined;
    if (hotelId) {
      try {
        const thumbnailUrl =
          await fetchRakutenRoomThumbnailUrl(hotelId);
        if (thumbnailUrl) {
          roomThumbnailUrl = thumbnailUrl;
        }
      } catch (error) {
        console.error(
          'Error fetching room thumbnail URL:',
          error
        );
        // エラーが発生しても処理を続行
      }
    }

    return {
      hotelName: object.hotelName || '',
      checkInDate: object.checkInDate,
      checkOutDate: object.checkOutDate,
      price: object.totalPrice,
      reservationId: object.reservationId,
      reservationSite: 'rakuten',
      cancellationDeadline: object.cancellationFeeStartDate,
      roomType: object.roomType,
      adultCount: object.adultCount,
      childCount: object.childCount,
      roomCount: object.roomCount,
      hotelUrl: object.hotelUrl,
      planName: object.planName,
      planUrl,
      hotelId: hotelId || undefined,
      hotelPostalCode: object.hotelPostalCode,
      hotelAddress: object.hotelAddress,
      hotelTelNo: object.hotelTelNo,
      roomThumbnailUrl,
    };
  } catch (error) {
    console.error(
      'Error parsing Rakuten reservation email:',
      error
    );
    return null;
  }
}

/**
 * 楽天トラベルからのメールかどうかを判定
 */
export function isRakutenEmail(
  message: GmailMessage
): boolean {
  const from = GmailClient.getHeader(message, 'From') || '';
  return (
    from.includes('rakuten.co.jp') ||
    from.includes('楽天トラベル')
  );
}
