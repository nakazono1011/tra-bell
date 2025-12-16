import type { PriceCheckResult } from "@/types";
import { chromium, type Page } from "playwright";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { createPriceCheckResult, createDefaultPriceResult } from "./utils";

/**
 * HTMLから価格を抽出するためのスキーマ
 */
const priceExtractionSchema = z.object({
  totalPrice: z
    .number()
    .describe("割引後の合計金額（円単位、カンマや記号は除去）"),
  priceFound: z.boolean().describe("価格が見つかったかどうか"),
  priceElement: z
    .string()
    .optional()
    .describe("価格が含まれていた要素の説明（デバッグ用）"),
});

/**
 * 楽天トラベルの価格抽出用プロンプトを生成
 */
function createRakutenPriceExtractionPrompt(
  hotelName: string,
  checkInDate: string,
  checkOutDate: string,
  planUrl: string,
  html: string,
  planName?: string,
  roomType?: string
): string {
  const planNameInfo = planName ? `- プラン名: ${planName}` : "";
  const roomTypeInfo = roomType ? `- 部屋タイプ: ${roomType}` : "";

  return `以下の楽天トラベルの予約ページのHTMLから、指定されたプランの割引後の合計金額を抽出してください。

【対象プランの情報】
- ホテル名: ${hotelName}
- チェックイン日: ${checkInDate}
- チェックアウト日: ${checkOutDate}
${planNameInfo}
${roomTypeInfo}
- プランURL: ${planUrl}

【HTML】
${html}

【抽出要件】
以下の情報を抽出してください:
- 割引後の合計金額（円単位、カンマや記号は除去）
- 価格が見つかったかどうか
- 価格が含まれていた要素の説明（デバッグ用）

【重要な注意事項】
1. 上記のホテル名、チェックイン日、チェックアウト日${
    planName ? "、プラン名" : ""
  }${roomType ? "、部屋タイプ" : ""}に一致するプランの価格を抽出してください
2. ページに複数のプランや価格が表示されている場合、指定された日付とホテル${
    planName ? "とプラン名" : ""
  }${roomType ? "と部屋タイプ" : ""}に該当するプランの価格のみを抽出してください
3. 楽天トラベルの割引後金額は、必ず<span>要素のclassName="discountedPrice"（またはclass="discountedPrice"）に含まれています。この要素から価格を抽出してください。他の要素（originalPrice、割引前価格など）は無視してください
4. originalPriceや割引前の価格は取得しないでください。必ず割引後の最終価格（discountedPriceクラスの要素）のみを抽出してください
5. 割引やクーポン適用後の最終的な金額（税込・サービス料込）を取得してください
6. 部屋代、食事代、その他の追加料金を含めた総額を抽出してください
7. HTML内に複数のdiscountedPrice要素がある場合、上記の条件（ホテル名、日付${
    planName ? "、プラン名" : ""
  }${
    roomType ? "、部屋タイプ" : ""
  }）に最も一致するプランのdiscountedPrice要素から価格を抽出してください`;
}

/**
 * ページを段階的にスクロールしてJavaScript実行を促す
 */
async function scrollPageGradually(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollDistance = scrollHeight - viewportHeight;
    const scrollSteps = 20;
    const stepDistance = totalScrollDistance / scrollSteps;
    const stepDelay = 100;

    for (let i = 0; i <= scrollSteps; i++) {
      const scrollPosition = Math.min(i * stepDistance, totalScrollDistance);
      window.scrollTo(0, scrollPosition);
      await new Promise((resolve) => setTimeout(resolve, stepDelay));
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
      console.log("Plan URL not provided, returning current price");
      return createDefaultPriceResult(reservationId, currentPrice);
    }

    // Browserlessに接続
    const browserlessUrl =
      process.env.BROWSERLESS_URL ||
      "wss://brd-customer-hl_72b2f430-zone-nakazono_test:722oaqxpvvxk@brd.superproxy.io:9222";
    const browser = await chromium.connectOverCDP(browserlessUrl);

    try {
      const page = await browser.newPage();

      // 楽天トラベルの予約ページを開く
      console.log(`Opening Rakuten plan page: ${planUrl}`);
      await page.goto(planUrl, {
        timeout: 60000,
        waitUntil: "domcontentloaded",
      });

      // ページが完全にレンダリングされるまで待つ
      await scrollPageGradually(page);
      await page.waitForTimeout(2000);

      // HTMLを取得
      const html = await page.content();

      // Google AI SDKのgenerateObjectを使用してHTMLから価格を抽出
      const prompt = createRakutenPriceExtractionPrompt(
        hotelName,
        checkInDate,
        checkOutDate,
        planUrl,
        html,
        planName,
        roomType
      );
      const { object } = await generateObject({
        model: google("gemini-2.5-flash"),
        schema: priceExtractionSchema,
        prompt,
      });

      console.log("Price extraction result:", object);
      // 価格が見つからなかった場合は現在価格を返す
      if (!object.priceFound || !object.totalPrice) {
        console.log("Price not found in HTML, returning current price");
        return createDefaultPriceResult(reservationId, currentPrice);
      }

      const newPrice = Math.round(object.totalPrice);
      return createPriceCheckResult(reservationId, currentPrice, newPrice);
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("Error checking Rakuten price:", error);
    // エラーが発生した場合は現在価格を返す
    return createDefaultPriceResult(reservationId, currentPrice);
  }
}
