'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check } from 'lucide-react';
import {
  containerVariants,
  itemVariants,
} from './constants';
import { RadioOption } from './radio-option';

export function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistId, setWaitlistId] = useState<
    string | null
  >(null);
  const [error, setError] = useState('');
  const [surveyData, setSurveyData] = useState({
    ota: '',
    osOrNotification: '',
    bookingTiming: '',
  });
  const [isSurveySubmitting, setIsSurveySubmitting] =
    useState(false);
  const [isSurveySubmitted, setIsSurveySubmitted] =
    useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '登録に失敗しました');
      }

      setIsSubmitted(true);
      if (data.waitlistId) {
        setWaitlistId(data.waitlistId);
      } else if (data.alreadyRegistered) {
        // 既に登録済みの場合でも、waitlistIdが返されない場合はエラーを表示
        setError(
          '登録情報の取得に失敗しました。ページを再読み込みしてください。'
        );
        setIsSubmitted(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '登録に失敗しました'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSurveySubmitting(true);

    if (!waitlistId) {
      setError('メール登録が完了していません');
      setIsSurveySubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/waitlist/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waitlistId,
          ...surveyData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'アンケートの送信に失敗しました'
        );
      }

      setIsSurveySubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'アンケートの送信に失敗しました'
      );
    } finally {
      setIsSurveySubmitting(false);
    }
  };

  return (
    <div
      id="waitlist"
      className="max-w-4xl mx-auto lg:px-12 scroll-mt-32 relative z-10"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="bg-white rounded-3xl py-8 px-4 lg:p-12 border border-[var(--bg-tertiary)] shadow-lg"
      >
        {!isSubmitted ? (
          <>
            <motion.h2
              variants={itemVariants}
              className="text-2xl lg:text-3xl font-bold mb-4 text-center text-[var(--text-primary)]"
            >
              ウェイトリストに登録
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-[var(--text-secondary)] text-base lg:text-lg mb-8 text-center"
            >
              サービス公開時に優先的にご案内します
            </motion.p>
            <motion.form
              variants={itemVariants}
              onSubmit={handleEmailSubmit}
              className="max-w-md mx-auto"
            >
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="メールアドレスを入力"
                  required
                  className="flex-1 px-4 py-3 rounded-xl border border-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] text-[var(--text-primary)]"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--text-on-accent)] px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? '登録中...'
                    : 'ウェイトリストに登録'}
                </button>
              </div>
              {error && (
                <p className="mt-4 text-sm text-red-500 text-center">
                  {error}
                </p>
              )}
            </motion.form>
          </>
        ) : !isSurveySubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-[var(--accent-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">
                登録完了！
              </h3>
              <p className="text-[var(--text-secondary)]">
                ご登録ありがとうございます。アンケートにご回答いただけますと、お客様のご意見をサービスに反映させていただきます。
              </p>
            </div>

            <form
              onSubmit={handleSurveySubmit}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-bold mb-3 text-[var(--text-primary)]">
                  A. 普段利用する予約サイト（OTA）は？
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    {
                      value: 'rakuten',
                      label: '楽天トラベル',
                    },
                    { value: 'jalan', label: 'じゃらん' },
                    { value: 'ikkyu', label: '一休.com' },
                    {
                      value: 'yahoo',
                      label: 'Yahoo!トラベル',
                    },
                    {
                      value: 'booking',
                      label: 'Booking.com',
                    },
                    { value: 'agoda', label: 'Agoda' },
                    { value: 'expedia', label: 'Expedia' },
                    { value: 'other', label: 'その他' },
                  ].map((option) => (
                    <RadioOption
                      key={option.value}
                      name="ota"
                      value={option.value}
                      label={option.label}
                      checked={
                        surveyData.ota === option.value
                      }
                      onChange={(e) =>
                        setSurveyData({
                          ...surveyData,
                          ota: e.target.value,
                        })
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3 text-[var(--text-primary)]">
                  B. 通知の希望手段は？
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    {
                      value: 'email',
                      label: 'メールで通知が欲しい',
                    },
                    {
                      value: 'line',
                      label: 'LINEで通知が欲しい',
                    },
                    {
                      value: 'ios',
                      label: 'iOSアプリから通知',
                    },
                    {
                      value: 'android',
                      label: 'Androidアプリから通知',
                    },
                  ].map((option) => (
                    <RadioOption
                      key={option.value}
                      name="osOrNotification"
                      value={option.value}
                      label={option.label}
                      checked={
                        surveyData.osOrNotification ===
                        option.value
                      }
                      onChange={(e) =>
                        setSurveyData({
                          ...surveyData,
                          osOrNotification: e.target.value,
                        })
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3 text-[var(--text-primary)]">
                  C. ホテル予約のタイミングは？
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: '6months',
                      label: '半年以上前',
                    },
                    {
                      value: '2-3months',
                      label: '2〜3ヶ月前',
                    },
                    { value: '1month', label: '1ヶ月前' },
                    { value: 'lastminute', label: '直前' },
                  ].map((option) => (
                    <RadioOption
                      key={option.value}
                      name="bookingTiming"
                      value={option.value}
                      label={option.label}
                      checked={
                        surveyData.bookingTiming ===
                        option.value
                      }
                      onChange={(e) =>
                        setSurveyData({
                          ...surveyData,
                          bookingTiming: e.target.value,
                        })
                      }
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSurveySubmitting}
                className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--text-on-accent)] px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSurveySubmitting
                  ? '送信中...'
                  : 'アンケートを送信'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-[var(--accent-light)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-[var(--accent-primary)]" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">
              ありがとうございます！
            </h3>
            <p className="text-[var(--text-secondary)]">
              アンケートへのご回答ありがとうございました。
              <br />
              サービスリリース時には優先的にご案内させていただきます。
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
