import Image from 'next/image';
import { steps } from './constants';

export function HowItWorksSection() {
  return (
    <section
      className="max-w-7xl mx-auto px-4 lg:px-12 mb-16 lg:mb-32 scroll-mt-32"
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
              <h3 className="text-xl font-bold mb-3">
                {step.title}
              </h3>
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
