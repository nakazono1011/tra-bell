"use client";

import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Mail,
  Sparkles,
  TrendingDown,
  Zap,
  ArrowRight,
  Hotel,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

// Data
const navLinks = [
  { href: "#problem", label: "Tra-bellとは" },
  { href: "#how-it-works", label: "仕組み" },
  { href: "#features", label: "特徴" },
  { href: "#faq", label: "よくある質問" },
];

const features = [
  { icon: Check, text: "完全無料" },
  { icon: Check, text: "クレカ登録不要" },
  { icon: Check, text: "24時間365日監視" },
];

const steps = [
  {
    step: "01",
    title: "連携する",
    desc: "Googleアカウントでログインして過去の予約確認メールを自動取得します。",
    icon: Mail,
    color: "bg-blue-500",
  },
  {
    step: "02",
    title: "自動監視",
    desc: "AIがあなたの予約を24時間365日、自動で監視し続けます。設定後は何もする必要がありません。",
    icon: Clock,
    color: "bg-[var(--accent-primary)]",
  },
  {
    step: "03",
    title: "通知が届く",
    desc: "価格が下がったら、LINEやメールでお知らせします。そのままリンクから再予約・キャンセルすれば、節約完了です。",
    icon: MessageCircleIcon,
    color: "bg-green-500",
  },
];

const faqs = [
  {
    question: "本当に無料ですか？なぜ無料なのですか？",
    answer:
      "はい、完全無料でご利用いただけます。現在はベータ版として提供しており、将来的にはホテル側への送客手数料や、プレミアム機能（オプション）による収益化を検討していますが、基本的な価格監視機能は無料で提供し続ける予定です。",
  },
  {
    question: "Googleアカウントの連携は安全ですか？",
    answer:
      "安全です。Tra-bellはGoogleの厳格な審査を通過しており、アクセス権限は「ホテル予約に関連するメールの閲覧」のみに限定されています。具体的には、メールの送信元を楽天トラベルやじゃらんに絞り、予約確認メールのみを抽出するようにしています。",
  },
  {
    question: "どの予約サイトに対応していますか？",
    answer:
      "現在は「楽天トラベル」と「じゃらんnet」の2大サイトに対応しています。その他の予約サイト（Booking.comやExpediaなど）も順次対応予定です。",
  },
  {
    question: "予約変更の手続きもやってくれますか？",
    answer:
      "いいえ、現時点では実際の再予約（予約の取り直し）は、お客様ご自身で行っていただく必要があります。Tra-bellは「価格が下がったこと」を通知し、再予約ページへのリンクを提供するところまでを自動化します。誤った予約変更を防ぐため、最終的な判断はお客様にお願いしています。",
  },
];

// Components
function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass-panel border-b-0 h-16 px-6 lg:px-12 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight flex items-center gap-2"
        >
          <Image
            src="/logos/logo.png"
            alt="Tra-bell"
            width={1240}
            height={400}
            className="h-16 w-auto object-contain"
            priority
            quality={100}
          />
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#waitlist"
            className="text-sm font-bold bg-[var(--accent-primary)] text-[var(--text-on-accent)] px-5 py-2.5 rounded-full hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
          >
            無料で始める
          </a>
        </div>
        <div className="md:hidden">
          <a
            href="#waitlist"
            className="text-sm font-bold bg-[var(--accent-primary)] text-[var(--text-on-accent)] px-4 py-2 rounded-full hover:bg-[var(--accent-hover)] transition-colors"
          >
            無料で始める
          </a>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 lg:mb-32"
    >
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
        <div>
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-1 rounded-full text-xs font-semibold text-[var(--text-secondary)] border border-[var(--bg-tertiary)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
            <span>予約後の「損」をゼロにするAIエージェント</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-2xl lg:text-6xl font-bold tracking-tight leading-10 lg:leading-[1.1] mb-4 lg:mb-8 text-[var(--text-primary)]"
          >
            そのホテル予約
            <br />
            <span className="text-[var(--accent-secondary)]">
              もっと安くなる
            </span>
            かもしれません。
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base lg:text-lg text-[var(--text-secondary)] mb-4 lg:mb-10 leading-relaxed max-w-md"
          >
            楽天トラベル・じゃらんで予約済みですか？
            <br />
            キャンセル料発生前なら、
            <br />
            もっと安いプランに簡単に乗り換えられます。
          </motion.p>

          <motion.div variants={itemVariants} className="mb-4 lg:mb-8">
            <a
              href="#waitlist"
              className="inline-flex justify-center items-center bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--text-on-accent)] lg:px-8 px-4 lg:py-3 py-2 rounded-xl font-bold text-base lg:text-lg shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              ウェイトリストに登録
            </a>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-4 lg:mt-8 flex items-center gap-4 lg:gap-6 text-xs font-medium text-[var(--text-tertiary)]"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[var(--accent-primary)]" />
                  {feature.text}
                </div>
              );
            })}
          </motion.div>
        </div>

        <PriceComparisonCard />
      </div>
    </motion.section>
  );
}

function PriceComparisonCard() {
  return (
    <motion.div
      variants={itemVariants}
      className="relative aspect-[4/3] lg:aspect-square bg-[var(--bg-secondary)] rounded-[2rem] overflow-hidden border border-[var(--bg-tertiary)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(241,196,43,0.1),transparent_50%)]" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[80%] h-[200px] bg-white rounded-2xl shadow-sm border border-[var(--bg-tertiary)] opacity-60 scale-90" />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-[var(--bg-tertiary)] p-6 z-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--rakuten)]/10 text-[var(--rakuten)] rounded-lg flex items-center justify-center font-bold">
                R
              </div>
              <div>
                <div className="text-xs text-[var(--text-tertiary)]">
                  東京ステーションホテル
                </div>
                <div className="text-sm font-bold">¥42,000</div>
              </div>
            </div>
            <div className="text-xs font-mono text-[var(--text-tertiary)]">
              予約時
            </div>
          </div>
          <div className="h-px bg-[var(--bg-secondary)] w-full my-4 relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-2">
              <TrendingDown className="w-6 h-6 text-[var(--accent-secondary)]" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent-light)] text-[var(--accent-primary)] rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-[var(--accent-secondary)] font-bold">
                  再予約チャンス
                </div>
                <div className="text-xl font-bold text-[var(--text-primary)]">
                  ¥35,800
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[var(--text-tertiary)]">
                節約額
              </div>
              <div className="text-sm font-bold text-[var(--accent-primary)]">
                -¥6,200
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProblemSection() {
  return (
    <section
      className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 lg:mb-32"
      id="problem"
    >
      <div className="text-center mb-16">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">
          {" "}
          Tra-bell（トラベル）とは？
        </h2>
        <p className="text-[var(--text-secondary)]">
          予約キャンセル料発生まで、最安値を監視し続け、「あとで安くなった」悔しさを無くします
        </p>
      </div>
      <div className="bg-[var(--bg-secondary)] rounded-3xl p-8 lg:p-16 border border-[var(--bg-tertiary)]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">
              ホテルの価格は、
              <br />
              <span className="text-[var(--accent-primary)]">予約後</span>
              に下がることがあります。
            </h3>
            <p className="text-[var(--text-secondary)] text-lg mb-8 leading-relaxed">
              「早く予約したから安心」と思っていませんか？
              実は、ホテルは空室を埋めるために、宿泊日が近づくと価格を下げることがあります。
            </p>
            <div className="flex flex-col gap-4">
              <InfoCard
                icon={AlertCircle}
                title="知らないうちに「損」をしている"
                description="一度予約してそのままにしていると、値下げに気づけず、高い料金のまま宿泊することになります。"
              />
              <InfoCard
                icon={Hotel}
                title="キャンセル料がかかるまではチャンス"
                description="キャンセル料が発生する前日までは、何度でも無料で予約を取り直すことができます。"
              />
            </div>
          </div>
          <PriceTimelineDiagram />
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-[var(--bg-tertiary)]">
      <Icon className="w-6 h-6 text-[var(--accent-secondary)] shrink-0 mt-1" />
      <div>
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
      </div>
    </div>
  );
}

function PriceTimelineDiagram() {
  return (
    <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-[var(--bg-tertiary)]">
      <div className="space-y-6">
        <div className="flex items-center justify-between opacity-50">
          <div className="flex items-center gap-3">
            <div className="size-12 text-xs bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
              1ヶ月前
            </div>
            <span className="font-medium text-gray-500">あなたが予約</span>
          </div>
          <span className="font-bold text-xl text-gray-400 line-through">
            ¥20,000
          </span>
        </div>
        <div className="flex justify-center -my-2">
          <ArrowRight className="w-5 h-5 text-gray-300 rotate-90" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 text-xs bg-[var(--accent-light)] rounded-full flex items-center justify-center font-bold text-[var(--accent-primary)]">
              1週間前
            </div>
            <span className="font-bold text-[var(--text-primary)]">
              空室を埋めるために値下げ
            </span>
          </div>
          <div className="text-right">
            <span className="block font-bold text-2xl text-[var(--accent-primary)]">
              ¥15,000
            </span>
            <span className="text-xs text-[var(--accent-secondary)] font-bold">
              ¥5,000 お得！
            </span>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-dashed border-gray-200 text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          Tra-bellはこの価格差を自動で検知して、あなたにお知らせします。
        </p>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  return (
    <section
      className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 lg:mb-32"
      id="how-it-works"
    >
      <div className="text-center mb-16">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">
          たった3ステップで完了
        </h2>
        <p className="text-[var(--text-secondary)]">
          Gmailをワンタップで連携するだけで、予約確認メールを自動取得し、最安値を監視します。
          <br />
          面倒な手続きは一切ありません。
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 relative">
        <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-[var(--bg-tertiary)] via-[var(--accent-light)] to-[var(--bg-tertiary)] -z-10" />
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              className="relative bg-white rounded-3xl p-8 border border-[var(--bg-tertiary)] shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              {i === 0 ? (
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform -translate-y-2">
                  <Image
                    src="/icon/gmail-icon.png"
                    alt="Gmail"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div
                  className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-lg transform -translate-y-2`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
              )}
              <div className="absolute top-6 right-6 text-4xl font-black text-gray-100 -z-10 select-none">
                {step.step}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section
      className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 lg:mb-32"
      id="features"
    >
      <div className="mb-8 lg:mb-12 text-center">
        <h2 className="text-xl lg:text-2xl font-bold mb-4">
          国内最大手の予約サイトで対応！
        </h2>
      </div>
      <SupportedSitesSection />
    </section>
  );
}

function SupportedSitesSection() {
  return (
    <section className="mt-12 lg:mt-16">
      <div className="relative bg-[var(--bg-secondary)] rounded-3xl p-12 lg:p-16 overflow-hidden">
        <div className="relative z-10">
          {/* Callout badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-xl px-4 py-2 border-2 border-[var(--accent-primary)]">
              <span className="text-[var(--accent-primary)] font-bold text-sm">
                順次拡大予定!
              </span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--accent-primary)]  text-center mb-12">
            対応サイト
          </h2>

          {/* Site logos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 楽天トラベル */}
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <Image
                src="/logos/rakuten_travel_logo.png"
                alt="楽天トラベル"
                width={200}
                height={80}
                className="mb-2 object-contain"
              />
            </div>

            {/* じゃらん */}
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <Image
                src="/logos/jalan_logo.png"
                alt="じゃらん"
                width={200}
                height={80}
                className="mb-2 object-contain"
              />
            </div>

            {/* 一休.com */}
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow opacity-60">
              <Image
                src="/logos/ikkyu_logo.png"
                alt="一休.com"
                width={200}
                height={80}
                className="mb-2 object-contain"
              />
              <div className="text-xs text-[var(--text-secondary)] flex items-center justify-center gap-1">
                <span>準備中</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section
      className="max-w-5xl mx-auto px-6 lg:px-12 mb-16 lg:mb-32"
      id="faq"
    >
      <div className="text-center mb-12">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">よくある質問</h2>
        <p className="text-[var(--text-secondary)]">
          ご不明な点は、こちらをご確認ください。
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-[var(--bg-tertiary)] p-2">
        <Accordion type="multiple" className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index + 1}`}
              className={
                index !== faqs.length - 1
                  ? "border-b-[var(--bg-tertiary)]"
                  : "border-none"
              }
            >
              <AccordionTrigger
                className={`px-6 text-left hover:no-underline text-lg font-bold hover:bg-[var(--bg-secondary)] data-[state=open]:bg-[var(--bg-secondary)] ${
                  index === 0 ? "rounded-t-xl" : ""
                } ${index === faqs.length - 1 ? "rounded-b-xl" : ""}`}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-4 text-[var(--text-secondary)]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-[var(--accent-light)] text-[var(--text-primary)] py-16 lg:py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary)] opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--accent-secondary)] opacity-10 rounded-full blur-3xl -ml-20 -mb-20"></div>
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="text-2xl lg:text-4xl font-bold mb-8 tracking-tight">
          まずは1件、
          <br />
          試してみませんか？
        </h2>
        <p className="text-[var(--text-secondary)] text-base lg:text-lg max-w-xl mx-auto">
          登録は30秒で完了します。もちろん無料です。
          <br />
          ホテル宿泊をお得に、Tra-bell（トラベル）を始めてみませんか？
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[var(--bg-tertiary)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logos/logo.png"
            alt="Tra-bell"
            width={1240}
            height={400}
            className="h-12 w-auto object-contain"
          />
        </Link>
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-[var(--text-secondary)]">
          <div>© 2025 Tra-bell All rights reserved.</div>
          <div className="hidden md:block">|</div>
          <div>
            運営会社:{" "}
            <a
              href="https://www.smile-comfort.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-primary)] hover:underline"
            >
              合同会社スマイルコンフォート
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [waitlistId, setWaitlistId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [surveyData, setSurveyData] = useState({
    ota: "",
    osOrNotification: "",
    bookingTiming: "",
  });
  const [isSurveySubmitting, setIsSurveySubmitting] = useState(false);
  const [isSurveySubmitted, setIsSurveySubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "登録に失敗しました");
      }

      setIsSubmitted(true);
      if (data.waitlistId) {
        setWaitlistId(data.waitlistId);
      } else if (data.alreadyRegistered) {
        // 既に登録済みの場合でも、waitlistIdが返されない場合はエラーを表示
        setError(
          "登録情報の取得に失敗しました。ページを再読み込みしてください。"
        );
        setIsSubmitted(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSurveySubmitting(true);

    if (!waitlistId) {
      setError("メール登録が完了していません");
      setIsSurveySubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/waitlist/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          waitlistId,
          ...surveyData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "アンケートの送信に失敗しました");
      }

      setIsSurveySubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "アンケートの送信に失敗しました"
      );
    } finally {
      setIsSurveySubmitting(false);
    }
  };

  return (
    <section
      id="waitlist"
      className="max-w-4xl mx-auto px-4 lg:px-6 lg:px-12 mb-16 lg:mb-32 mt-16 lg:mt-32 scroll-mt-32"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="bg-white rounded-3xl p-8 lg:p-12 border border-[var(--bg-tertiary)] shadow-lg"
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
              <div className="flex flex-col sm:flex-row gap-4">
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
                  {isSubmitting ? "登録中..." : "ウェイトリストに登録"}
                </button>
              </div>
              {error && (
                <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
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

            <form onSubmit={handleSurveySubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-3 text-[var(--text-primary)]">
                  A. 普段利用する予約サイト（OTA）は？
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: "rakuten", label: "楽天トラベル" },
                    { value: "jalan", label: "じゃらん" },
                    { value: "ikkyu", label: "一休.com" },
                    { value: "yahoo", label: "Yahoo!トラベル" },
                    { value: "booking", label: "Booking.com" },
                    { value: "agoda", label: "Agoda" },
                    { value: "expedia", label: "Expedia" },
                    { value: "other", label: "その他" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-3 border border-[var(--bg-tertiary)] rounded-lg cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <input
                        type="radio"
                        name="ota"
                        value={option.value}
                        checked={surveyData.ota === option.value}
                        onChange={(e) =>
                          setSurveyData({ ...surveyData, ota: e.target.value })
                        }
                        required
                        className="mr-2"
                      />
                      <span className="text-sm text-[var(--text-primary)]">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3 text-[var(--text-primary)]">
                  B. 通知の希望手段は？
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: "email", label: "メールで通知が欲しい" },
                    { value: "line", label: "LINEで通知が欲しい" },
                    { value: "ios", label: "iOSアプリから通知" },
                    { value: "android", label: "Androidアプリから通知" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-3 border border-[var(--bg-tertiary)] rounded-lg cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <input
                        type="radio"
                        name="osOrNotification"
                        value={option.value}
                        checked={surveyData.osOrNotification === option.value}
                        onChange={(e) =>
                          setSurveyData({
                            ...surveyData,
                            osOrNotification: e.target.value,
                          })
                        }
                        required
                        className="mr-2"
                      />
                      <span className="text-sm text-[var(--text-primary)]">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3 text-[var(--text-primary)]">
                  C. ホテル予約のタイミングは？
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "6months", label: "半年以上前" },
                    { value: "2-3months", label: "2〜3ヶ月前" },
                    { value: "1month", label: "1ヶ月前" },
                    { value: "lastminute", label: "直前" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-3 border border-[var(--bg-tertiary)] rounded-lg cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <input
                        type="radio"
                        name="bookingTiming"
                        value={option.value}
                        checked={surveyData.bookingTiming === option.value}
                        onChange={(e) =>
                          setSurveyData({
                            ...surveyData,
                            bookingTiming: e.target.value,
                          })
                        }
                        required
                        className="mr-2"
                      />
                      <span className="text-sm text-[var(--text-primary)]">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSurveySubmitting}
                className="w-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--text-on-accent)] px-8 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSurveySubmitting ? "送信中..." : "アンケートを送信"}
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
    </section>
  );
}

// Main Component
export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden selection:bg-[var(--accent-primary)] selection:text-[var(--text-on-accent)]">
      <Navbar />
      <main className="pt-20 lg:pt-32">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <FAQSection />
        <CTASection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
}

function MessageCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}
