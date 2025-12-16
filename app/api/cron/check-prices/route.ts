import { NextResponse } from "next/server";
import { checkAllActivePrices } from "@/lib/price-checker";

/**
 * Vercel Cron認証
 * Vercel Cronからのリクエストには `x-vercel-signature` ヘッダーが自動的に追加されます
 * 手動トリガーの場合は `CRON_SECRET` 環境変数を使用して認証します
 */
function verifyCronRequest(request: Request): boolean {
  // Vercel Cronからのリクエストか確認（x-vercel-signatureヘッダーが存在する場合）
  const vercelSignature = request.headers.get("x-vercel-signature");
  if (vercelSignature) {
    // Vercel Cronからのリクエストは自動的に検証されるため、ヘッダーが存在すればOK
    return true;
  }

  // 手動トリガーの場合、CRON_SECRETで認証
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    return authHeader === `Bearer ${cronSecret}`;
  }

  // CRON_SECRETが設定されていない場合は、開発環境として許可
  // 本番環境では必ずCRON_SECRETを設定してください
  return process.env.NODE_ENV !== "production";
}

export async function GET(request: Request) {
  try {
    // Cron認証
    if (!verifyCronRequest(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Starting price check cron job...");
    const startTime = Date.now();

    // 全てのアクティブな予約の価格をチェック
    const result = await checkAllActivePrices();

    const duration = Date.now() - startTime;
    console.log(
      `Price check completed: ${result.checked} checked, ${result.priceDrops} drops, ${result.errors} errors (${duration}ms)`
    );

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Price check cron error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POSTでも実行可能に（手動トリガー用）
export async function POST(request: Request) {
  return GET(request);
}
