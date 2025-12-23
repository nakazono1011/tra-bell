import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 価格値下がり通知メールのHTMLテンプレートを生成
 */
function generatePriceDropEmailHtml(
  hotelName: string,
  formattedPriceDrop: string,
  formattedPercentage: string,
  checkInDate: string,
  checkOutDate: string,
  linkUrl: string,
  buttonText: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">価格が下がりました！</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; margin-bottom: 20px;">
            こんにちは、
          </p>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
            <h2 style="margin-top: 0; color: #92400e; font-size: 20px;">${hotelName}</h2>
            <p style="margin-bottom: 10px; color: #78350f; font-size: 18px; font-weight: bold;">
              価格が <span style="color: #dc2626; font-size: 24px;">${formattedPriceDrop}</span>（${formattedPercentage}%）下がりました！
            </p>
            <p style="margin: 0; color: #78350f;">
              チェックイン: ${checkInDate}<br>
              チェックアウト: ${checkOutDate}
            </p>
          </div>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            キャンセル料発生前であれば、無料でキャンセル・再予約が可能です。お得な価格で再予約をご検討ください。
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${linkUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              ${buttonText}
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            このメールは自動送信されています。ご不明な点がございましたら、お気軽にお問い合わせください。<br>
            <a href="mailto:support@tra-bell.com" style="color: #f59e0b; text-decoration: none;">support@tra-bell.com</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>© 2025 Tra-bell All rights reserved.</p>
          <p>運営: 合同会社スマイルコンフォート</p>
        </div>
      </body>
    </html>
  `;
}

/**
 * 価格値下がり通知メールを送信
 */
export async function sendPriceDropEmail(
  to: string,
  hotelName: string,
  priceDropAmount: number,
  priceDropPercentage: number,
  checkInDate: string,
  checkOutDate: string,
  reservationId: string,
  affiliateUrl?: string | null
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      'RESEND_API_KEY is not set, skipping email send'
    );
    return;
  }

  const formattedPriceDrop = `¥${priceDropAmount.toLocaleString()}`;
  const formattedPercentage =
    priceDropPercentage.toFixed(1);

  // リンクURL: アフィリエイトURLがあればそれを使用、なければアプリURL
  const linkUrl =
    affiliateUrl ||
    `${process.env.NEXT_PUBLIC_APP_URL || 'https://tra-bell.com'}/dashboard/reservations/${reservationId}`;

  const buttonText = affiliateUrl
    ? '予約を取り直す'
    : '予約詳細を確認する';

  const fromEmail =
    process.env.RESEND_FROM_EMAIL || 'support@tra-bell.com';

  try {
    await resend.emails.send({
      from: `Tra-bell <${fromEmail}>`,
      to,
      subject: `【Tra-bell】${hotelName}の価格が${formattedPriceDrop}下がりました`,
      html: generatePriceDropEmailHtml(
        hotelName,
        formattedPriceDrop,
        formattedPercentage,
        checkInDate,
        checkOutDate,
        linkUrl,
        buttonText
      ),
    });
  } catch (error) {
    console.error(
      'Failed to send price drop email:',
      error
    );
    // メール送信失敗はログに記録するが、エラーは再スローする
    // （呼び出し側で適切に処理する必要がある）
    throw error;
  }
}
