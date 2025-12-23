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
  console.log(
    `[checkRakutenPrice] 開始 - reservationId: ${reservationId}, hotelName: ${hotelName}, planUrl: ${planUrl || 'なし'}`
  );

  try {
    // planUrlがない場合は現在価格を返す
    if (!planUrl) {
      console.log(
        `[checkRakutenPrice] Plan URL not provided, returning current price - reservationId: ${reservationId}`
      );
      return createDefaultPriceResult(
        reservationId,
        currentPrice
      );
    }

    // Browserlessに接続
    const browserlessUrl =
      'wss://brd-customer-hl_72b2f430-zone-nakazono_test-country-jp:722oaqxpvvxk@brd.superproxy.io:9222';

    console.log(
      `[checkRakutenPrice] Browserless接続開始 - URL: ${browserlessUrl.substring(0, 50)}...`
    );
    let browser;
    try {
      browser =
        await chromium.connectOverCDP(browserlessUrl);
      console.log(
        `[checkRakutenPrice] Browserless接続成功 - reservationId: ${reservationId}`
      );
    } catch (connectError) {
      console.error(
        `[checkRakutenPrice] Browserless接続失敗 - reservationId: ${reservationId}`,
        {
          error:
            connectError instanceof Error
              ? connectError.message
              : String(connectError),
          stack:
            connectError instanceof Error
              ? connectError.stack
              : undefined,
          url: browserlessUrl,
        }
      );
      throw connectError;
    }

    try {
      console.log(
        `[checkRakutenPrice] 新しいページを作成中 - reservationId: ${reservationId}`
      );
      const page = await browser.newPage();
      console.log(
        `[checkRakutenPrice] ページ作成成功 - reservationId: ${reservationId}`
      );

      // 楽天トラベルの予約ページを開く
      console.log(
        `[checkRakutenPrice] 楽天トラベルの予約ページを開く - planUrl: ${planUrl}, reservationId: ${reservationId}`
      );
      try {
        await page.goto(planUrl, {
          timeout: 60000,
          waitUntil: 'domcontentloaded',
        });
        console.log(
          `[checkRakutenPrice] ページナビゲーション成功 - reservationId: ${reservationId}`
        );
      } catch (gotoError) {
        console.error(
          `[checkRakutenPrice] ページナビゲーション失敗 - reservationId: ${reservationId}`,
          {
            error:
              gotoError instanceof Error
                ? gotoError.message
                : String(gotoError),
            stack:
              gotoError instanceof Error
                ? gotoError.stack
                : undefined,
            planUrl,
          }
        );
        throw gotoError;
      }

      // ページが完全にレンダリングされるまで待つ
      console.log(
        `[checkRakutenPrice] ページスクロール開始 - reservationId: ${reservationId}`
      );
      try {
        await scrollPageGradually(page);
        console.log(
          `[checkRakutenPrice] ページスクロール完了 - reservationId: ${reservationId}`
        );
      } catch (scrollError) {
        console.error(
          `[checkRakutenPrice] ページスクロール失敗 - reservationId: ${reservationId}`,
          {
            error:
              scrollError instanceof Error
                ? scrollError.message
                : String(scrollError),
          }
        );
        // スクロールエラーは続行可能なので、ログだけ残して続行
      }

      console.log(
        `[checkRakutenPrice] 2秒待機中 - reservationId: ${reservationId}`
      );
      await page.waitForTimeout(2000);

      // プラン名と部屋タイプで絞り込んで価格を取得
      console.log(
        `[checkRakutenPrice] 価格要素を検索中 - planName: ${planName || 'なし'}, roomType: ${roomType || 'なし'}, reservationId: ${reservationId}`
      );
      let priceLocator = planName
        ? page.locator('li.planThumb', {
            hasText: planName,
          })
        : page.locator('li.planThumb');

      if (roomType) {
        console.log(
          `[checkRakutenPrice] 部屋タイプで絞り込み中 - roomType: ${roomType}, reservationId: ${reservationId}`
        );
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
      console.log(
        `[checkRakutenPrice] 価格要素の数をカウント中 - reservationId: ${reservationId}`
      );
      const count = await priceElement.count();
      console.log(
        `[checkRakutenPrice] 価格要素の数: ${count} - reservationId: ${reservationId}`
      );

      if (count === 0) {
        console.log(
          `[checkRakutenPrice] 価格要素が見つかりませんでした - reservationId: ${reservationId}, planName: ${planName || 'なし'}, roomType: ${roomType || 'なし'}`
        );
        return createDefaultPriceResult(
          reservationId,
          currentPrice
        );
      }

      // 価格テキストを取得して数値を抽出
      console.log(
        `[checkRakutenPrice] 価格テキストを取得中 - reservationId: ${reservationId}`
      );
      const priceText = await priceElement
        .first()
        .innerText();
      console.log(
        `[checkRakutenPrice] 価格テキスト抽出成功: "${priceText}" - reservationId: ${reservationId}`
      );

      console.log(
        `[checkRakutenPrice] 価格数値を抽出中 - reservationId: ${reservationId}`
      );
      const extractedPrice =
        extractPriceFromText(priceText);
      if (extractedPrice === null) {
        console.log(
          `[checkRakutenPrice] 価格数値の抽出に失敗 - priceText: "${priceText}", reservationId: ${reservationId}`
        );
        return createDefaultPriceResult(
          reservationId,
          currentPrice
        );
      }

      const newPrice = Math.round(extractedPrice);
      console.log(
        `[checkRakutenPrice] 価格チェック完了 - 現在価格: ${currentPrice}, 新価格: ${newPrice}, reservationId: ${reservationId}`
      );
      return createPriceCheckResult(
        reservationId,
        currentPrice,
        newPrice
      );
    } catch (innerError) {
      console.error(
        `[checkRakutenPrice] 内部処理エラー - reservationId: ${reservationId}`,
        {
          error:
            innerError instanceof Error
              ? innerError.message
              : String(innerError),
          stack:
            innerError instanceof Error
              ? innerError.stack
              : undefined,
          errorName:
            innerError instanceof Error
              ? innerError.name
              : undefined,
        }
      );
      throw innerError;
    } finally {
      console.log(
        `[checkRakutenPrice] ブラウザを閉じる - reservationId: ${reservationId}`
      );
      try {
        await browser.close();
        console.log(
          `[checkRakutenPrice] ブラウザクローズ成功 - reservationId: ${reservationId}`
        );
      } catch (closeError) {
        console.error(
          `[checkRakutenPrice] ブラウザクローズ失敗 - reservationId: ${reservationId}`,
          {
            error:
              closeError instanceof Error
                ? closeError.message
                : String(closeError),
          }
        );
      }
    }
  } catch (error) {
    console.error(
      `[checkRakutenPrice] エラー発生 - reservationId: ${reservationId}`,
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
        stack:
          error instanceof Error ? error.stack : undefined,
        errorName:
          error instanceof Error ? error.name : undefined,
        hotelName,
        checkInDate,
        checkOutDate,
        planUrl,
        planName,
        roomType,
      }
    );
    // エラーが発生した場合は現在価格を返す
    return createDefaultPriceResult(
      reservationId,
      currentPrice
    );
  }
}
