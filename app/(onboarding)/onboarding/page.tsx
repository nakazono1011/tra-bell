"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "@/app/actions/onboarding";
import Image from "next/image";
import { ArrowRight, Check, Mail, Bell, Hotel } from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 3;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await completeOnboarding();
    } catch (err) {
      console.error("Onboarding failed:", err);
      setError(
        "オンボーディングの完了に失敗しました。もう一度お試しください。"
      );
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const steps = [
    {
      id: 1,
      title: "Tra-bellへようこそ",
      description: "旅行の予約後も、もっとお得に。",
      content: (
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 bg-orange-50 rounded-full flex items-center justify-center p-8 mb-4">
            <Hotel className="w-32 h-32 text-orange-500" />
            <div className="absolute -bottom-4 bg-white px-4 py-2 rounded-full shadow-lg border border-orange-100 text-orange-700 font-bold text-sm">
              自動で価格チェック
            </div>
          </div>
          <div className="text-center space-y-4 max-w-sm">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Tra-bellは、あなたが予約したホテルの価格を
              <br />
              <span className="font-bold text-[var(--accent-primary)]">
                24時間365日
              </span>
              監視します。
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              同じ条件で価格が下がったら、
              <br />
              すぐにお知らせ。
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Gmailと連携",
      description: "予約確認メールから自動で登録",
      content: (
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 bg-blue-50 rounded-full flex items-center justify-center p-8 mb-4">
            <Mail className="w-32 h-32 text-blue-500" />
            <div className="absolute top-0 right-0 bg-white p-3 rounded-full shadow-md">
              <Image
                src="/logos/logo.png"
                alt="Tra-bell"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          </div>
          <div className="text-center space-y-4 max-w-sm">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Gmailを連携すると、宿泊予約メールを自動で検知。
              <br />
              手動で情報を入力する手間はありません。
            </p>
            <div className="bg-[var(--bg-secondary)] p-4 rounded-lg text-xs text-[var(--text-secondary)] text-left border border-[var(--bg-tertiary)]">
              <p className="font-bold mb-1">安心のセキュリティ</p>
              <ul className="list-disc list-inside space-y-1">
                <li>宿泊予約メールのみを読み取ります</li>
                <li>その他のメールにはアクセスしません</li>
                <li>データは暗号化して保存されます</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "値下がりを検知",
      description: "キャンセル期限まで監視を継続",
      content: (
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 bg-orange-50 rounded-full flex items-center justify-center p-8 mb-4">
            <Bell className="w-32 h-32 text-orange-500" />
            <div className="absolute top-10 left-0 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-orange-100 text-orange-600 font-bold text-xs animate-bounce">
              ¥5,000 OFF!
            </div>
          </div>
          <div className="text-center space-y-4 max-w-sm">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              キャンセル期限が来るまで、
              <br />
              毎日自動で価格をチェックします。
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              値下がりが見つかったら通知します。
              <br />
              あとは再予約して、差額をゲットするだけ。
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-6 text-[var(--text-primary)]">
      <div className="w-full max-w-[360px] flex flex-col items-center">
        {/* Progress Dots */}
        <div className="flex space-x-2 mb-8 shrink-0">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map(
            (stepNumber) => (
              <div
                key={stepNumber}
                className={`h-2 rounded-full transition-all duration-300 ${
                  stepNumber === step
                    ? "w-8 bg-[var(--accent-primary)]"
                    : stepNumber < step
                    ? "w-2 bg-orange-200"
                    : "w-2 bg-[var(--bg-tertiary)]"
                }`}
              />
            )
          )}
        </div>

        {/* Content Area */}
        <div className="flex flex-col w-full mb-8 h-[600px] shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center h-full"
            >
              <div className="text-center mb-8 shrink-0">
                <h2 className="text-2xl font-bold mb-2 tracking-tight">
                  {steps[step - 1].title}
                </h2>
                <p className="text-[var(--text-secondary)]">
                  {steps[step - 1].description}
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
                {steps[step - 1].content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="w-full space-y-3 shrink-0">
          {error && (
            <div className="w-full p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs text-center">
              {error}
            </div>
          )}
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="w-full h-14 text-lg font-bold rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white shadow-lg shadow-orange-200 transition-all hover:shadow-xl hover:shadow-orange-300 active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                {step === totalSteps ? "始める" : "次へ"}
                {step === totalSteps ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
              </span>
            )}
          </Button>
          {step > 1 && (
            <div className="h-10">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={isLoading}
                className="w-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              >
                戻る
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
