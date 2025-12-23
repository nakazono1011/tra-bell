import { SupportedSitesSection } from './supported-sites-section';

export function FeaturesSection() {
  return (
    <section
      className="max-w-7xl mx-auto px-6 lg:px-12 mb-16 lg:mb-32 scroll-mt-32"
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
