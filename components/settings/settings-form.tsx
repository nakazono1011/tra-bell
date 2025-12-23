'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';

interface SettingsFormProps {
  initialSettings: {
    priceDropThreshold: number;
    priceDropPercentage: number;
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
  const [isConnectingGmail, setIsConnectingGmail] =
    useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage(null);

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: 'success',
          text: '設定を保存しました',
        });
        router.refresh();
      } else {
        setMessage({
          type: 'error',
          text: data.error || '保存に失敗しました',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: '保存中にエラーが発生しました',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectGmail = async () => {
    try {
      setIsConnectingGmail(true);
      await signIn.social({
        provider: 'google',
        callbackURL: '/dashboard/settings?gmail=connected',
      });
    } catch {
      setMessage({
        type: 'error',
        text: 'Gmail連携に失敗しました',
      });
    } finally {
      setIsConnectingGmail(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Gmail Connection */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Gmail連携
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-[var(--text-secondary)]">
              Gmailと連携して予約確認メールを自動取得
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              楽天トラベル・じゃらんの予約メールを自動で読み取ります
            </p>
          </div>

          {hasGmailScope ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 shrink-0">
              <svg
                className="w-5 h-5 text-emerald-600 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs font-medium text-emerald-600 whitespace-nowrap">
                連携済
              </span>
            </div>
          ) : (
            <button
              onClick={handleConnectGmail}
              disabled={isConnectingGmail}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 shrink-0"
            >
              {isConnectingGmail ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                  >
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
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                  >
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
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          価格監視設定
        </h2>

        <div className="space-y-6">
          {/* Price Drop Threshold (Amount) */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              値下がり通知閾値（金額）
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.priceDropThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priceDropThreshold:
                      parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-32 px-4 py-2 rounded-xl bg-white border border-gray-300 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                min="0"
                step="100"
              />
              <span className="text-[var(--text-secondary)]">
                円以上
              </span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              この金額以上値下がりした場合に通知します
            </p>
          </div>

          {/* Price Drop Threshold (Percentage) */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              値下がり通知閾値（パーセント）
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.priceDropPercentage}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priceDropPercentage:
                      parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-32 px-4 py-2 rounded-xl bg-white border border-gray-300 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                min="0"
                max="100"
              />
              <span className="text-[var(--text-secondary)]">
                %以上
              </span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              このパーセント以上値下がりした場合に通知します（金額とOR条件）
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        {message && (
          <p
            className={`text-sm ${
              message.type === 'success'
                ? 'text-emerald-600'
                : 'text-red-600'
            }`}
          >
            {message.text}
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
        >
          {isSaving ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                viewBox="0 0 24 24"
              >
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
            '設定を保存'
          )}
        </button>
      </div>
    </div>
  );
}
