import Image from 'next/image';

export function SupportedSitesSection() {
  return (
    <section className="mt-12 lg:mt-16">
      <div className="relative bg-[var(--bg-secondary)] rounded-3xl py-8 px-4 lg:p-16 overflow-hidden">
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
