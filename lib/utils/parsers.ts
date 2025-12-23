import type { GmailMessage } from '@/types';
import { GmailClient } from '@/lib/gmail/client';

/**
 * メール本文から日付を抽出（共通ロジック）
 */
export function extractDate(
  body: string,
  patterns: RegExp[]
): string | undefined {
  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) {
      const year = match[1];
      const month = match[2].padStart(2, '0');
      const day = match[3].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  return undefined;
}

/**
 * メール本文から数値を抽出（共通ロジック）
 */
export function extractNumber(
  body: string,
  patterns: RegExp[]
): number | undefined {
  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''), 10);
    }
  }
  return undefined;
}

/**
 * メール本文からテキストを抽出（共通ロジック）
 */
export function extractText(
  body: string,
  patterns: RegExp[]
): string | undefined {
  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) {
      return match[1]?.trim();
    }
  }
  return undefined;
}

/**
 * Gmailメッセージから本文を取得（共通ロジック）
 */
export function getEmailBody(
  message: GmailMessage
): string {
  const textBody =
    GmailClient.extractTextFromMessage(message);
  const htmlBody =
    GmailClient.extractHtmlFromMessage(message);
  return htmlBody || textBody || '';
}
