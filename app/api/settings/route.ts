import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { userSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const settingsSchema = z.object({
  priceDropThreshold: z.number().int().min(0).max(1000000),
  priceDropPercentage: z.number().int().min(0).max(100),
  autoRebookEnabled: z.boolean(),
});

export async function POST(request: Request) {
  try {
    // 認証チェック
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // 入力検証
    const validationResult = settingsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    const { priceDropThreshold, priceDropPercentage, autoRebookEnabled } =
      validationResult.data;

    // 既存の設定を確認
    const [existingSettings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    if (existingSettings) {
      // 更新
      await db
        .update(userSettings)
        .set({
          priceDropThreshold,
          priceDropPercentage,
          autoRebookEnabled,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, userId));
    } else {
      // 新規作成
      await db.insert(userSettings).values({
        userId,
        priceDropThreshold,
        priceDropPercentage,
        autoRebookEnabled,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 認証チェック
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, session.user.id))
      .limit(1);

    return NextResponse.json({
      success: true,
      data: settings || {
        priceDropThreshold: 500,
        priceDropPercentage: 5,
        autoRebookEnabled: false,
        gmailConnected: false,
      },
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

