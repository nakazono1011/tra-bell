"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import Image from "next/image";
import { Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      setError("ログインに失敗しました。もう一度お試しください。");
      console.error("Sign in error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 text-[var(--text-primary)]">
      <div className="w-full max-w-[360px] flex flex-col items-center">
        {/* Logo */}
        <div className="w-64 relative h-40">
          <Image
            src="/logos/logo.png"
            alt="Tra-bell"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Hero Text */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold mb-3 tracking-tight">
            そのホテル予約、
            <br />
            <span className="text-[var(--accent-primary)]">もっと安く</span>
            なるかもしれません。
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            予約後の「損」をゼロにするAIエージェント
            <br />
            値下がりしたら、すぐにお知らせします。
          </p>
        </div>

        {/* Features */}
        <div className="w-full space-y-4 mb-10">
          <div className="flex items-center gap-4 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--bg-tertiary)]">
            <div className="bg-white p-2.5 rounded-lg shrink-0 border border-[var(--bg-tertiary)] flex items-center justify-center">
              <Image
                src="/icon/gmail-icon.png"
                alt="Gmail"
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div className="text-sm font-bold text-[var(--text-secondary)]">
              メールから宿泊プランを自動取得
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--bg-tertiary)]">
            <div className="bg-orange-50 p-2.5 rounded-lg text-[var(--accent-primary)] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-[var(--text-secondary)]">
              24時間365日 宿泊価格を監視
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--bg-tertiary)]">
            <div className="bg-green-50 p-2.5 rounded-lg text-green-600 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-[var(--text-secondary)]">
              値下がりを通知でお知らせ
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs text-center">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-6 rounded-full bg-white border border-[var(--bg-tertiary)] text-[var(--text-primary)] font-bold shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-[var(--bg-tertiary)] border-t-[var(--accent-primary)] rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span>Googleで始める</span>
        </Button>

        {/* Terms */}
        <p className="mt-8 text-center text-xs text-[var(--text-tertiary)] leading-relaxed">
          ログインすることで、
          <a
            href="#"
            className="text-[var(--text-secondary)] underline hover:text-[var(--accent-primary)] mx-1"
          >
            利用規約
          </a>
          と
          <a
            href="#"
            className="text-[var(--text-secondary)] underline hover:text-[var(--accent-primary)] mx-1"
          >
            プライバシーポリシー
          </a>
          に<br />
          同意したものとみなされます。
        </p>
      </div>
    </div>
  );
}
