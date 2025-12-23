import type { ParsedReservation } from '@/types';
import type { GmailMessage } from '@/types';
import { GmailClient } from '@/lib/gmail/client';
import {
  getEmailBody,
  extractText,
  extractDate,
  extractNumber,
} from '@/lib/utils/parsers';

/**
 * じゃらんの予約確認メールをパース
 */
export function parseJalanReservationEmail(
  message: GmailMessage
): ParsedReservation | null {
  try {
    const body = getEmailBody(message);

    if (!body) {
      console.log('No body found in Jalan email');
      return null;
    }

    // ホテル名を抽出
    const hotelName = extractText(body, [
      /【宿名】\s*(.+?)(?:\n|<br|<\/)/,
      /宿泊施設[：:]\s*(.+?)(?:\n|<br|<\/)/,
    ]);

    if (!hotelName) {
      console.log('Hotel name not found in Jalan email');
      return null;
    }

    // 予約番号を抽出
    const reservationId = extractText(body, [
      /予約番号[：:]\s*(\d+)/,
      /【予約番号】\s*(\d+)/,
    ]);

    if (!reservationId) {
      console.log(
        'Reservation ID not found in Jalan email'
      );
      return null;
    }

    // チェックイン日を抽出
    const checkInDate = extractDate(body, [
      /チェックイン[：:]\s*(\d{4})[年/](\d{1,2})[月/](\d{1,2})日?/,
      /【宿泊日】\s*(\d{4})年(\d{1,2})月(\d{1,2})日/,
    ]);

    if (!checkInDate) {
      console.log('Check-in date not found in Jalan email');
      return null;
    }

    // チェックアウト日を抽出
    let checkOutDate = extractDate(body, [
      /チェックアウト[：:]\s*(\d{4})[年/](\d{1,2})[月/](\d{1,2})日?/,
      /〜\s*(\d{4})年(\d{1,2})月(\d{1,2})日/,
    ]);

    // チェックアウト日が取得できない場合、チェックイン日の翌日とする
    if (!checkOutDate && checkInDate) {
      const checkIn = new Date(checkInDate);
      checkIn.setDate(checkIn.getDate() + 1);
      checkOutDate = checkIn.toISOString().split('T')[0];
    }

    if (!checkOutDate) {
      console.log(
        'Check-out date not found in Jalan email'
      );
      return null;
    }

    // 料金を抽出
    const price =
      extractNumber(body, [
        /合計金額[：:]\s*[￥¥]?\s*([\d,]+)\s*円?/,
        /お支払い金額[：:]\s*[￥¥]?\s*([\d,]+)\s*円?/,
      ]) || 0;

    // キャンセルポリシーからキャンセル期限を抽出
    const cancelDate = extractDate(body, [
      /(\d{4})[年/](\d{1,2})[月/](\d{1,2})日?\s*(?:まで|以降)[は]?(?:無料|キャンセル)/,
    ]);
    const cancellationDeadline = cancelDate
      ? `${cancelDate}T23:59:59`
      : undefined;

    // プラン名を抽出（roomTypeとplanNameで同じ値を使用）
    const planName = extractText(body, [
      /【プラン】\s*(.+?)(?:\n|<br|<\/)/,
      /プラン名[：:]\s*(.+?)(?:\n|<br|<\/)/,
    ]);
    const roomType = planName;
    const planUrl = extractText(body, [
      /プランURL[：:]\s*(https?:\/\/[^\s]+)/,
      /プラン[：:]\s*(https?:\/\/[^\s]+)/,
    ]);

    // 大人と子供の人数を別々に抽出
    const adultCount = extractNumber(body, [
      /大人[：:]\s*(\d+)\s*名/,
      /大人\s*(\d+)\s*名/,
      /(\d+)\s*名\s*（大人）/,
    ]);
    const childCount = extractNumber(body, [
      /子供[：:]\s*(\d+)\s*名/,
      /子供\s*(\d+)\s*名/,
      /(\d+)\s*名\s*（子供）/,
      /小人[：:]\s*(\d+)\s*名/,
      /小人\s*(\d+)\s*名/,
    ]);

    // 部屋数を抽出
    const roomCount = extractNumber(body, [
      /部屋数[：:]\s*(\d+)\s*室/,
      /申込部屋数[：:]\s*(\d+)/,
      /(\d+)\s*室/,
      /部屋[：:]\s*(\d+)\s*室/,
    ]);

    // ホテル情報を抽出
    const hotelPostalCode = extractText(body, [
      /郵便番号[：:]\s*(\d{3}-?\d{4})/,
      /〒\s*(\d{3}-?\d{4})/,
    ]);
    const hotelAddress = extractText(body, [
      /住所[：:]\s*(.+?)(?:\n|<br|郵便番号|電話)/,
      /【住所】\s*(.+?)(?:\n|<br|郵便番号|電話)/,
    ]);
    const hotelTelNo = extractText(body, [
      /電話番号[：:]\s*([\d-]+)/,
      /TEL[：:]\s*([\d-]+)/,
      /【電話】\s*([\d-]+)/,
    ]);

    return {
      hotelName,
      checkInDate,
      checkOutDate,
      price,
      reservationId,
      reservationSite: 'jalan',
      cancellationDeadline,
      roomType,
      adultCount: adultCount || undefined,
      childCount: childCount || undefined,
      roomCount: roomCount || undefined,
      planName: planName || undefined,
      planUrl: planUrl || undefined,
      hotelPostalCode: hotelPostalCode || undefined,
      hotelAddress: hotelAddress || undefined,
      hotelTelNo: hotelTelNo || undefined,
    };
  } catch (error) {
    console.error(
      'Error parsing Jalan reservation email:',
      error
    );
    return null;
  }
}

/**
 * じゃらんからのメールかどうかを判定
 */
export function isJalanEmail(
  message: GmailMessage
): boolean {
  const from = GmailClient.getHeader(message, 'From') || '';
  return (
    from.includes('jalan.net') || from.includes('じゃらん')
  );
}
