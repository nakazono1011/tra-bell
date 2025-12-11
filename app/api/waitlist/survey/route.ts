import { NextResponse } from "next/server";
import { db } from "@/db";
import { waitlistSurvey, waitlist } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const surveySchema = z.object({
  waitlistId: z.string().uuid("無効なIDです"),
  ota: z.enum(["rakuten", "jalan", "booking", "agoda", "expedia", "other"], {
    message: "OTAを選択してください",
  }),
  osOrNotification: z.enum(["ios", "android", "pc", "line", "email"], {
    message: "OS/通知手段を選択してください",
  }),
  bookingTiming: z.enum(["6months", "2-3months", "1month", "lastminute"], {
    message: "予約タイミングを選択してください",
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = surveySchema.parse(body);

    // waitlistIdが存在するか確認
    const [waitlistEntry] = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.id, data.waitlistId))
      .limit(1);

    if (!waitlistEntry) {
      return NextResponse.json(
        { success: false, error: "ウェイトリスト登録が見つかりません" },
        { status: 404 },
      );
    }

    // 既にアンケートが回答されているかチェック
    const existing = await db
      .select()
      .from(waitlistSurvey)
      .where(eq(waitlistSurvey.waitlistId, data.waitlistId))
      .limit(1);

    if (existing.length > 0) {
      // 既存の回答を更新
      await db
        .update(waitlistSurvey)
        .set({
          ota: data.ota,
          osOrNotification: data.osOrNotification,
          bookingTiming: data.bookingTiming,
        })
        .where(eq(waitlistSurvey.waitlistId, data.waitlistId));

      return NextResponse.json(
        { success: true, message: "アンケートを更新しました" },
        { status: 200 },
      );
    }

    // 新しいアンケート回答を保存
    await db.insert(waitlistSurvey).values({
      waitlistId: data.waitlistId,
      ota: data.ota,
      osOrNotification: data.osOrNotification,
      bookingTiming: data.bookingTiming,
    });

    return NextResponse.json(
      {
        success: true,
        message: "アンケートにご回答いただき、ありがとうございます",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0].message },
        { status: 400 },
      );
    }

    console.error("Survey submission error:", error);
    return NextResponse.json(
      { success: false, error: "アンケートの送信に失敗しました" },
      { status: 500 },
    );
  }
}
