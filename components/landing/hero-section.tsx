import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { containerVariants, itemVariants, features } from "./constants";
import { PriceComparisonCard } from "./price-comparison-card";

export function HeroSection() {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 lg:px-12 mb-16 lg:mb-32"
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

