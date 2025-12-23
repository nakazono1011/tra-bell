import { ArrowRight } from 'lucide-react';

export function PriceTimelineDiagram() {
  return (
    <div className="relative bg-white rounded-2xl p-8 shadow-sm border border-[var(--bg-tertiary)]">
      <div className="space-y-6">
        <div className="flex items-center justify-between opacity-50">
          <div className="flex items-center gap-3">
            <div className="size-12 text-[10px] lg:text-xs bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
              1ヶ月前
            </div>
            <span className="font-medium text-sm lg:text-base text-gray-500">
              あなたが予約
            </span>
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
            <div className="w-12 h-12 text-[10px] lg:text-xs bg-[var(--accent-light)] rounded-full flex items-center justify-center font-bold text-[var(--accent-primary)]">
              1週間前
            </div>
            <span className="font-bold text-sm lg:text-base text-[var(--text-primary)]">
              値下げ
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
