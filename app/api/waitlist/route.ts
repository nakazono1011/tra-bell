import { NextResponse } from "next/server";
import { db } from "@/db";
import { waitlist } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const waitlistSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = waitlistSchema.parse(body);

    // 既に登録されているかチェック
    const existing = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: "既に登録済みです",
          alreadyRegistered: true,
          waitlistId: existing[0].id,
        },
        { status: 200 }
      );
    }

    // ウェイトリストに登録
    const [newWaitlist] = await db
      .insert(waitlist)
      .values({ email })
      .returning();

    // ウェルカムメールを送信
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "support@tra-bell.com",
        to: email,
        subject: "Tra-bellウェイトリストへようこそ",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Tra-bellウェイトリストへようこそ！</h1>
              </div>
              
              <div style="background: #ffffff; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <p style="font-size: 16px; margin-bottom: 20px;">
                  ${email} 様
                </p>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                  この度は、Tra-bellのウェイトリストにご登録いただき、誠にありがとうございます。
                </p>
                
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
                  <h2 style="margin-top: 0; color: #92400e; font-size: 20px;">Tra-bellとは？</h2>
                  <p style="margin-bottom: 10px; color: #78350f;">
                    Tra-bellは、楽天トラベル・じゃらんで予約済みのホテルを24時間365日自動監視し、価格が下がったらお知らせするサービスです。
                  </p>
                  <ul style="margin: 0; padding-left: 20px; color: #78350f;">
                    <li>完全無料</li>
                    <li>クレカ登録不要</li>
                    <li>キャンセル料発生前なら、何度でも無料で予約を取り直し可能</li>
                  </ul>
                </div>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                  サービスリリース時には、優先的にご案内させていただきます。今しばらくお待ちください。
                </p>
                
                <p style="font-size: 14px; color: #666; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  ご不明な点がございましたら、お気軽にお問い合わせください。<br>
                  <a href="mailto:support@tra-bell.com" style="color: #f59e0b; text-decoration: none;">support@tra-bell.com</a>
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                <p>© 2025 Tra-bell All rights reserved.</p>
                <p>運営: 合同会社スマイルコンフォート</p>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // メール送信失敗しても登録は成功とする
    }

    return NextResponse.json(
      {
        success: true,
        message: "ウェイトリストに登録しました",
        waitlistId: newWaitlist.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Waitlist registration error:", error);
    return NextResponse.json(
      { success: false, error: "登録に失敗しました" },
      { status: 500 }
    );
  }
}
