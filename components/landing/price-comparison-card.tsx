import { motion } from 'framer-motion';
import { TrendingDown, Zap } from 'lucide-react';
import { itemVariants } from './constants';

export function PriceComparisonCard() {
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
                <div className="text-sm font-bold">
                  ¥42,000
                </div>
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
