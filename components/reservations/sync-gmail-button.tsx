"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SyncGmailButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const router = useRouter();

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setResult(null);

      const response = await fetch("/api/gmail/fetch-reservations", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message: `${data.data.newReservationsSaved}件の新しい予約を取得しました`,
        });
        router.refresh();
      } else {
        setResult({
          success: false,
          message: data.error || "同期に失敗しました",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "同期中にエラーが発生しました",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSyncing ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            同期中...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Gmailから同期
          </>
        )}
      </button>

      {result && (
        <p
          className={`text-sm ${
            result.success ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}
