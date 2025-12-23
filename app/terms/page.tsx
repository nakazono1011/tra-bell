import type { Metadata } from 'next';
import { StaticPageLayout } from '@/components/landing/static-page-layout';
import { CompanyInfo } from '@/components/landing/company-info';

export const metadata: Metadata = {
  title: '利用規約',
  description: 'Tra-bellの利用規約です。',
};

export default function TermsPage() {
  return (
    <StaticPageLayout>
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-8">
          利用規約
        </h1>

        <div className="text-[var(--text-secondary)] leading-relaxed space-y-6">
          <p>
            本利用規約（以下「本規約」といいます。）は、合同会社スマイルコンフォート（以下「当社」といいます。）が提供する「Tra-bell」（以下「本サービス」といいます。）の利用条件を定めるものです。ユーザーは、本規約に同意のうえ本サービスを利用するものとし、本サービスを利用した場合、本規約に同意したものとみなされます。
          </p>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第1条（適用）
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されます。
              </li>
              <li>
                当社が本サービス上で掲載する注意事項、ヘルプ、ガイドライン等（以下「個別規定」といいます。）は本規約の一部を構成します。個別規定と本規約が矛盾する場合、当社が別途定める場合を除き個別規定が優先します。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第2条（本サービスの概要）
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                本サービスは、ユーザーが提供する宿泊予約に関する情報（以下「予約情報」といいます。）に基づき、当社所定の方法で宿泊料金等の情報を収集・比較し、価格変動等に関する情報を通知・表示するサービスです。
              </li>
              <li>
                本サービスは<strong>ベータ版</strong>
                であり、機能・表示・提供条件等が予告なく変更される場合があります。
              </li>
              <li>
                本サービスは、宿泊予約の成立、変更、取消、返金、支払、トラブル対応等を当社が代理して行うものではありません。これらはユーザーと予約先（宿泊施設、予約サイト等の第三者。以下「外部サービス」といいます。）との間で行われます。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第3条（通知・連絡）
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                当社は、本サービスの提供にあたり、価格変動等の通知、運営上必要な連絡を、メールその他当社所定の方法により行うことがあります。
              </li>
              <li>
                ユーザーは、当社からの通知を受け取れる状態を維持するものとします。通知の不達・遅延等によりユーザーに不利益が生じても、当社は責任を負いません。
              </li>
              <li>
                ユーザーが通知の停止等を希望する場合、当社所定の方法で手続を行うものとし、その結果として本サービスの全部または一部が利用できなくなる場合があります。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第4条（登録・アカウント管理）
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                本サービスの利用に登録が必要な場合、ユーザーは当社所定の方法で登録を行うものとします。
              </li>
              <li>
                ユーザーは、登録情報を真実かつ正確に提供し、変更がある場合は速やかに更新するものとします。
              </li>
              <li>
                ユーザーは、自己の責任でアカウント等を管理し、第三者に利用させてはなりません。
              </li>
              <li>
                当社は、当社の判断により、ユーザーのアカウントを停止・削除し、または本サービスの利用を制限できるものとします。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第5条（予約情報の提供方法：Gmail連携・転送）
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                ユーザーは、本サービスの利用のため、以下の方法で予約情報を当社に提供することがあります。
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>
                    <strong>Gmail連携</strong>
                    ：ユーザーがGoogleアカウント連携（OAuth等）により、当社が予約関連メールを検索・解析することを許可する方法
                  </li>
                  <li>
                    <strong>メール転送</strong>
                    ：ユーザーが予約確認メール等を当社指定の方法で転送する方法
                  </li>
                </ul>
              </li>
              <li>
                ユーザーは、当社が本サービス提供の目的で、前項により提供・取得した予約情報を解析し、通知等に利用することに同意します。
              </li>
              <li>
                ユーザーは、当社に提供する予約情報について、適法に提供できる権限を有することを保証します。
              </li>
              <li>
                外部サービス（Google等）の仕様変更、提供停止、制限等により本サービスの全部または一部が利用できない場合があります。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第6条（外部サービス）
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                本サービスは、外部サービスの情報に基づく表示、外部サービスへのリンク、利用手順の案内等を含む場合があります。
              </li>
              <li>
                外部サービスの内容、料金、在庫（空室）、キャンセル条件、返金条件、税・手数料等は外部サービスの定めによります。ユーザーは外部サービスの表示・条件を自ら確認のうえ利用するものとします。
              </li>
              <li>
                当社は、外部サービスの内容・安全性・正確性・最新性・有用性、またユーザーにとっての有利性等について保証しません。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第7条（ユーザーの責任：再予約・取消等）
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                本サービスが表示・通知する情報は参考情報であり、最終的な判断・手続はユーザーが自己の責任で行うものとします。
              </li>
              <li>
                ユーザーは、新たな予約を行う前に、既存予約の取消可否および取消料等の条件を必ず確認するものとします。
              </li>
              <li>
                ユーザーが既存予約の取消を行わない等により二重予約等が生じた場合でも、当社は責任を負いません。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第8条（料金・返金）
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                本サービスが有料で提供される場合、料金、支払方法等は当社が別途定め、本サービス上で表示します。
              </li>
              <li>
                <strong>
                  （返金）当社が受領した利用料金は、当社が別途認める場合を除き、返金しません。
                </strong>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第9条（知的財産権）
            </h2>
            <p>
              本サービスおよび本サービス上のコンテンツ（文章、画像、デザイン、プログラム、ロゴ等）に関する知的財産権は当社または正当な権利者に帰属します。ユーザーは、当社の許可なく複製、転載、改変、配布、公開、逆コンパイル等をしてはなりません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第10条（禁止事項）
            </h2>
            <p>
              ユーザーは、以下の行為をしてはなりません。
            </p>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>
                当社または第三者の権利・利益を侵害する行為
              </li>
              <li>
                不正アクセス、過度な負荷、運営妨害、解析・改ざん等の行為
              </li>
              <li>
                虚偽情報の登録、なりすまし、アカウントの譲渡・貸与・共有
              </li>
              <li>
                本サービスを利用した無断の営業・勧誘・スパム行為
              </li>
              <li>
                外部サービスの規約に違反する態様での利用
              </li>
              <li>その他当社が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第11条（免責）
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                当社は、本サービスが中断しないこと、エラーがないこと、通知が必ず到達すること、情報が常に完全・正確・最新であること、価格低下等の成果が得られることを保証しません。
              </li>
              <li>
                当社は、外部サービスに起因する料金・在庫・表示・決済・返金・取消等に関して責任を負いません。
              </li>
              <li>
                本サービスの利用に関連してユーザーに損害が生じた場合であっても、当社は当社の責に帰すべき事由がある場合を除き責任を負いません。
              </li>
              <li>
                当社が損害賠償責任を負う場合であっても、当社の責任は通常生じうる直接かつ現実の損害に限られ、（有料の場合）当該損害が発生した月を含む直近1か月間にユーザーが当社に支払った利用料金を上限とします。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第12条（利用停止・終了）
            </h2>
            <p>
              当社は、当社の判断により、ユーザーへの事前通知なく、本サービスの全部または一部の提供を停止・中断・終了し、またはユーザーの利用を制限できるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第13条（規約の変更）
            </h2>
            <p>
              当社は、当社の判断により本規約を変更できるものとします。変更後の本規約は、本サービス上での掲示その他当社所定の方法により周知した時点から効力を生じます。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第14条（反社会的勢力の排除）
            </h2>
            <p>
              ユーザーは、反社会的勢力等に該当せず、また関与しないことを表明し保証します。当社は、ユーザーがこれに違反したと判断した場合、利用停止等の措置を講じることができます。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第15条（準拠法・合意管轄）
            </h2>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>本規約の準拠法は日本法とします。</li>
              <li>
                本サービスに関して紛争が生じた場合、
                <strong>
                  東京地方裁判所または東京簡易裁判所
                </strong>
                を第一審の専属的合意管轄裁判所とします。
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">
              第16条（事業者情報・問い合わせ窓口）
            </h2>
            <CompanyInfo />
          </section>

          <div className="mt-12 pt-8 border-t border-[var(--bg-tertiary)] text-sm text-[var(--text-tertiary)]">
            <p>
              <strong>制定日</strong>：2025年12月24日
            </p>
            <p>
              <strong>最終改定日</strong>
              ：2025年12月23日
            </p>
            <p className="mt-4">
              Copyright © Smile Comfort LLC. All Rights
              Reserved.
            </p>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
}
