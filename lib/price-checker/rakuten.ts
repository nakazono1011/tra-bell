import type { PriceCheckResult } from '@/types';
import { chromium, type Page } from 'playwright';
import {
  createPriceCheckResult,
  createDefaultPriceResult,
} from './utils';

/**
 * 価格テキストから数値を抽出（カンマや記号を除去）
 */
function extractPriceFromText(
  priceText: string
): number | null {
  // カンマ、円記号、括弧内の文字を除去して数値を抽出
  const priceMatch = priceText
    .replace(/[,\s円（()）]/g, '')
    .match(/\d+/);
  if (priceMatch) {
    return parseInt(priceMatch[0], 10);
  }
  return null;
}

/**
 * ページを段階的にスクロールしてJavaScript実行を促す
 */
export async function scrollPageGradually(
  page: Page
): Promise<void> {
  await page.evaluate(async () => {
    const scrollHeight =
      document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollDistance =
      scrollHeight - viewportHeight;
    const scrollSteps = 20;
    const stepDistance = totalScrollDistance / scrollSteps;
    const stepDelay = 100;

    for (let i = 0; i <= scrollSteps; i++) {
      const scrollPosition = Math.min(
        i * stepDistance,
        totalScrollDistance
      );
      window.scrollTo(0, scrollPosition);
      await new Promise((resolve) =>
        setTimeout(resolve, stepDelay)
      );
    }
  });
}

/**
 * 楽天トラベルの価格を取得
 * PlaywrightとBrowserlessを使用して予約ページから価格を取得
 */
export async function checkRakutenPrice(
  hotelName: string,
  checkInDate: string,
  checkOutDate: string,
  reservationId: string,
  currentPrice: number,
  planUrl?: string,
  planName?: string,
  roomType?: string
): Promise<PriceCheckResult | null> {
  try {
    // planUrlがない場合は現在価格を返す
    if (!planUrl) {
      console.log(
        'Plan URL not provided, returning current price'
      );
      return createDefaultPriceResult(
        reservationId,
        currentPrice
      );
    }

    // Browserlessに接続
    const browserlessUrl =
      "'wss://brd-customer-hl_72b2f430-zone-nakazono_test:722oaqxpvvxk@brd.superproxy.io:9222'";

    const browser =
      await chromium.connectOverCDP(browserlessUrl);

    try {
      const page = await browser.newPage();

      // 楽天トラベルの予約ページを開く
      console.log(`Opening Rakuten plan page: ${planUrl}`);
      await page.goto(planUrl, {
        timeout: 60000,
        waitUntil: 'domcontentloaded',
      });

      // ページが完全にレンダリングされるまで待つ
      await scrollPageGradually(page);
      await page.waitForTimeout(2000);

      // プラン名と部屋タイプで絞り込んで価格を取得
      let priceLocator = planName
        ? page.locator('li.planThumb', {
            hasText: planName,
          })
        : page.locator('li.planThumb');

      if (roomType) {
        priceLocator = priceLocator.locator(
          'li.rm-type-wrapper',
          {
            hasText: roomType,
          }
        );
      }

      // 価格要素を取得
      const priceElement = priceLocator.locator(
        '.discountedPrice > strong'
      );
      const count = await priceElement.count();
      if (count === 0) {
        console.log(
          'Price element not found, returning current price'
        );
        return createDefaultPriceResult(
          reservationId,
          currentPrice
        );
      }

      // 価格テキストを取得して数値を抽出
      const priceText = await priceElement
        .first()
        .innerText();
      console.log('Price text extracted:', priceText);

      const extractedPrice =
        extractPriceFromText(priceText);
      if (extractedPrice === null) {
        console.log(
          'Failed to extract price from text, returning current price'
        );
        return createDefaultPriceResult(
          reservationId,
          currentPrice
        );
      }

      const newPrice = Math.round(extractedPrice);
      return createPriceCheckResult(
        reservationId,
        currentPrice,
        newPrice
      );
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('Error checking Rakuten price:', error);
    // エラーが発生した場合は現在価格を返す
    return createDefaultPriceResult(
      reservationId,
      currentPrice
    );
  }
}
