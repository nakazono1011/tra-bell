import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { userSettings, accounts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // ユーザー設定を取得
  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1);

  // Google連携状態を確認
  const [googleAccount] = await db
    .select()
    .from(accounts)
    .where(
      and(
        eq(accounts.userId, session.user.id),
        eq(accounts.providerId, "google")
      )
    )
    .limit(1);

  const hasGmailScope =
    googleAccount?.scope?.includes("gmail.readonly") || false;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">設定</h1>
        <p className="text-slate-400 mt-1">価格監視と自動処理の設定を管理</p>
      </div>

      {/* Settings Form */}
      <SettingsForm
        initialSettings={{
          priceDropThreshold: settings?.priceDropThreshold ?? 500,
          priceDropPercentage: settings?.priceDropPercentage ?? 5,
          autoRebookEnabled: settings?.autoRebookEnabled ?? false,
          gmailConnected: settings?.gmailConnected ?? false,
        }}
        hasGmailScope={hasGmailScope || (settings?.gmailConnected ?? false)}
      />
    </div>
  );
}
