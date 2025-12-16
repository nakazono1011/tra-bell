import { Check, Clock, Mail } from "lucide-react";
import { MessageCircleIcon } from "./message-circle-icon";

export const navLinks = [
  { href: "#problem", label: "Tra-bellとは" },
  { href: "#how-it-works", label: "仕組み" },
  { href: "#features", label: "特徴" },
  { href: "#faq", label: "よくある質問" },
];

export const features = [
  { icon: Check, text: "完全無料" },
  { icon: Check, text: "クレカ登録不要" },
  { icon: Check, text: "24時間365日監視" },
];

export const steps = [
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
    desc: "あなたの予約したプランと同じプランが値下げしたら、お知らせします。設定後は何もする必要がありません。",
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

export const faqs = [
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

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

