import { NextResponse } from 'next/server';
import { checkAllActivePrices } from '@/lib/price-checker';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting price check cron job...');
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
    console.error('Price check cron error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POSTでも実行可能に（手動トリガー用）
export async function POST(request: Request) {
  return GET(request);
}
