import type { GmailMessage } from "@/types";
import type { ParsedReservation } from "@/types";
import {
  isRakutenEmail,
  parseRakutenReservationEmail,
} from "@/lib/parsers/rakuten";
import { isJalanEmail, parseJalanReservationEmail } from "@/lib/parsers/jalan";

export interface ParsedEmailResult {
  messageId: string;
  reservation: ParsedReservation | null;
  source: "rakuten" | "jalan" | "unknown";
  receivedAt: Date;
}

/**
 * Gmailメッセージから予約情報をパース
 */
export async function parseReservationEmail(
  message: GmailMessage
): Promise<ParsedEmailResult> {
  const messageId = message.id;
  const receivedAt = new Date(parseInt(message.internalDate, 10));

  // 楽天トラベルのメールをパース
  if (isRakutenEmail(message)) {
    const reservation = await parseRakutenReservationEmail(message);
    console.log("reservation", reservation);
    return {
      messageId,
      reservation,
      source: "rakuten",
      receivedAt,
    };
  }

  // じゃらんのメールをパース
  if (isJalanEmail(message)) {
    const reservation = parseJalanReservationEmail(message);
    return {
      messageId,
      reservation,
      source: "jalan",
      receivedAt,
    };
  }

  return {
    messageId,
    reservation: null,
    source: "unknown",
    receivedAt,
  };
}

/**
 * 複数のGmailメッセージから予約情報をパース
 */
export async function parseReservationEmails(
  messages: GmailMessage[]
): Promise<ParsedEmailResult[]> {
  return Promise.all(messages.map((message) => parseReservationEmail(message)));
}

/**
 * パースされた予約情報から有効なものだけをフィルタ
 */
export function filterValidReservations(
  results: ParsedEmailResult[]
): ParsedEmailResult[] {
  return results.filter((result) => result.reservation !== null);
}

/**
 * 重複する予約を除去（予約番号でユニーク）
 */
export function deduplicateReservations(
  results: ParsedEmailResult[]
): ParsedEmailResult[] {
  const seen = new Set<string>();
  return results.filter((result) => {
    if (!result.reservation) return false;

    const key = `${result.reservation.reservationSite}-${result.reservation.reservationId}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
