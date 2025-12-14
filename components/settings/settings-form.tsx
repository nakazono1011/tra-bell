"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

interface SettingsFormProps {
  initialSettings: {
    priceDropThreshold: number;
    priceDropPercentage: number;
    autoRebookEnabled: boolean;
    gmailConnected: boolean;
  };
  hasGmailScope: boolean;
}

export function SettingsForm({
  initialSettings,
  hasGmailScope,
}: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage(null);

      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "設定を保存しました" });
        router.refresh();
      } else {
        setMessage({ type: "error", text: data.error || "保存に失敗しました" });
      }
    } catch {
      setMessage({ type: "error", text: "保存中にエラーが発生しました" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectGmail = async () => {
    try {
      setIsConnectingGmail(true);
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard/settings?gmail=connected",
      });
    } catch {
      setMessage({ type: "error", text: "Gmail連携に失敗しました" });
    } finally {
      setIsConnectingGmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Gmail Connection */}
      <div className="rounded-2xl border border-[var(--bg-tertiary)] bg-white p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Gmail連携</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">
              Gmailと連携して予約確認メールを自動取得
            </p>
            <p className="text-xs text-slate-500 mt-1">
              楽天トラベル・じゃらんの予約メールを自動で読み取ります
            </p>
          </div>

          {hasGmailScope ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-emerald-400">
                連携済み
              </span>
            </div>
          ) : (
            <button
              onClick={handleConnectGmail}
              disabled={isConnectingGmail}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isConnectingGmail ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  連携中...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                  </svg>
                  Gmailを連携
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Price Drop Thresholds */}
      <div className="rounded-2xl border border-[var(--bg-tertiary)] bg-white p-6">
        <h2 className="text-lg font-semibold text-white mb-4">価格監視設定</h2>

        <div className="space-y-6">
          {/* Price Drop Threshold (Amount) */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              値下がり通知閾値（金額）
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.priceDropThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priceDropThreshold: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-32 px-4 py-2 rounded-xl bg-white border border-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                min="0"
                step="100"
              />
              <span className="text-slate-400">円以上</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              この金額以上値下がりした場合に通知します
            </p>
          </div>

          {/* Price Drop Threshold (Percentage) */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              値下がり通知閾値（パーセント）
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.priceDropPercentage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priceDropPercentage: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-32 px-4 py-2 rounded-xl bg-white border border-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                min="0"
                max="100"
              />
              <span className="text-slate-400">%以上</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              このパーセント以上値下がりした場合に通知します（金額とOR条件）
            </p>
          </div>
        </div>
      </div>

      {/* Auto Rebook Settings */}
      <div className="rounded-2xl border border-[var(--bg-tertiary)] bg-white p-6">
        <h2 className="text-lg font-semibold text-white mb-4">自動処理設定</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">自動キャンセル・再予約</p>
            <p className="text-xs text-slate-500 mt-1">
              値下がりを検知した場合に自動でキャンセル・再予約を実行
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoRebookEnabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  autoRebookEnabled: e.target.checked,
                })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--bg-tertiary)] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-400/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[var(--bg-tertiary)] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
          </label>
        </div>

        {settings.autoRebookEnabled && (
          <div className="mt-4 p-4 rounded-xl bg-amber-400/10 border border-amber-400/20">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm text-amber-400 font-medium">注意</p>
                <p className="text-xs text-amber-300/80 mt-1">
                  自動キャンセル・再予約を有効にすると、閾値を超える値下がりを検知した場合に
                  自動的にキャンセル処理が実行されます。この機能は慎重に使用してください。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        {message && (
          <p
            className={`text-sm ${
              message.type === "success" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              保存中...
            </>
          ) : (
            "設定を保存"
          )}
        </button>
      </div>
    </div>
  );
}
