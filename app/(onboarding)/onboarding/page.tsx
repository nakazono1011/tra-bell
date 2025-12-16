"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { completeOnboarding } from "@/app/actions/onboarding";
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
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-orange-50 rounded-full flex items-center justify-center p-6 sm:p-8 mb-2 sm:mb-4 shrink-0">
            <Hotel className="w-24 h-24 sm:w-32 sm:h-32 text-orange-500" />
            <div className="absolute -bottom-3 sm:-bottom-4 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border border-orange-100 text-orange-700 font-bold text-xs sm:text-sm">
              自動で価格チェック
            </div>
          </div>
          <div className="text-center space-y-3 sm:space-y-4 max-w-sm w-full">
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              Tra-bellは、あなたが予約したホテルの価格を
              <br />
              <span className="font-bold text-[var(--accent-primary)]">
                24時間365日
              </span>
              監視します。
            </p>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
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
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-blue-50 rounded-full flex items-center justify-center p-6 sm:p-8 mb-2 sm:mb-4 shrink-0">
            <Mail className="w-24 h-24 sm:w-32 sm:h-32 text-blue-500" />
          </div>
          <div className="text-center space-y-3 sm:space-y-4 max-w-sm w-full">
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              Gmailを連携すると、宿泊予約メールを自動で検知。
              <br />
              手動で情報を入力する手間はありません。
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "値下がりを検知",
      description: "キャンセル期限まで監視を継続",
      content: (
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 bg-orange-50 rounded-full flex items-center justify-center p-6 sm:p-8 mb-2 sm:mb-4 shrink-0">
            <Bell className="w-24 h-24 sm:w-32 sm:h-32 text-orange-500" />
          </div>
          <div className="text-center space-y-3 sm:space-y-4 max-w-sm w-full">
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              キャンセル期限が来るまで、
              <br />
              毎日自動で価格をチェックします。
            </p>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
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
    <div className="h-screen bg-[var(--bg-warm)] flex flex-col items-center px-4 py-16 sm:p-6 text-[var(--text-primary)] overflow-hidden">
      <div className="w-full max-w-[360px] flex flex-col items-center h-full py-4 sm:py-6">
        {/* Progress Dots */}
        <div className="flex space-x-2 mb-4 sm:mb-6 shrink-0">
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
        <div className="flex flex-col w-full flex-1 min-h-0 mb-4 sm:mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center h-full min-h-0"
            >
              <div className="text-center mb-4 sm:mb-6 shrink-0">
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 tracking-tight">
                  {steps[step - 1].title}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {steps[step - 1].description}
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center w-full overflow-hidden min-h-0">
                <div className="w-full h-full flex items-center justify-center overflow-y-auto">
                  {steps[step - 1].content}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="w-full space-y-2 sm:space-y-3 shrink-0">
          {error && (
            <div className="w-full p-2.5 sm:p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs text-center">
              {error}
            </div>
          )}
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white shadow-lg shadow-orange-200 transition-all hover:shadow-xl hover:shadow-orange-300 active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                {step === totalSteps ? "始める" : "次へ"}
                {step === totalSteps ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </span>
            )}
          </Button>
          {step > 1 && (
            <div className="h-9 sm:h-10">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={isLoading}
                className="w-full h-9 sm:h-10 text-sm sm:text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
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
