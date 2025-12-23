import { WaitlistSection } from './waitlist-section';

export function CTASection() {
  return (
    <section className="bg-[var(--accent-light)] text-[var(--text-primary)] py-16 lg:py-24 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary)] opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--accent-secondary)] opacity-10 rounded-full blur-3xl -ml-20 -mb-20"></div>
      <div className="max-w-3xl mx-auto text-center relative z-10 mb-12">
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
      <WaitlistSection />
    </section>
  );
}
