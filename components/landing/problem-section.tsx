import { AlertCircle, Hotel } from "lucide-react";
import { InfoCard } from "./info-card";
import { PriceTimelineDiagram } from "./price-timeline-diagram";

export function ProblemSection() {
  return (
    <section
      className="max-w-7xl mx-auto px-4 lg:px-12 mb-16 lg:mb-32 scroll-mt-32"
      id="problem"
    >
      <div className="text-center mb-8 lg:mb-16">
        <h2 className="text-2xl lg:text-3xl font-bold mb-4">
          {" "}
          Tra-bell（トラベル）とは？
        </h2>
        <p className="text-[var(--text-secondary)]">
          予約キャンセル料発生まで、最安値を監視し続け、「あとで安くなった」悔しさを無くします
        </p>
      </div>
      <div className="bg-[var(--bg-secondary)] rounded-3xl py-8 px-4 lg:p-16 border border-[var(--bg-tertiary)]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-6 text-[var(--text-primary)]">
              ホテルの価格は
              <br />
              <span className="text-[var(--accent-primary)]">予約後</span>
              によく下がります
            </h3>
            <p className="text-[var(--text-secondary)] text-sm lg:text-lg mb-8 leading-relaxed">
              「早く予約したから安心」と思っていませんか？
              実は、ホテルは空室を埋めるために、宿泊日が近づくと価格を下げることがよくあります。
            </p>
            <div className="flex flex-col gap-4">
              <InfoCard
                icon={AlertCircle}
                title="知らないうちに「損」をしている"
                description="一度予約してそのままにしていると、値下げに気づけず、高い料金のまま宿泊することになります。"
              />
              <InfoCard
                icon={Hotel}
                title="キャンセル料が発生まではチャンス"
                description="キャンセル料が発生する前日までは、何度でも無料で予約を取り直すことができるので、もっと安いプランに簡単に乗り換えられます。"
              />
            </div>
          </div>
          <PriceTimelineDiagram />
        </div>
      </div>
    </section>
  );
}

