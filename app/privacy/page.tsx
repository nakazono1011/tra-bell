import type { Metadata } from 'next';
import { StaticPageLayout } from '@/components/landing/static-page-layout';
import { CompanyInfo } from '@/components/landing/company-info';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'Tra-bellのプライバシーポリシーです。',
};

export default function PrivacyPage() {
  return (
    <StaticPageLayout>
      <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4">
        プライバシーポリシー
      </h1>
      <p className="text-[var(--text-secondary)] leading-relaxed mb-10">
        合同会社スマイルコンフォート（以下「当社」といいます。）は、当社が提供する「Tra-bell」（以下「本サービス」といいます。）において取得・利用するユーザーに関する情報（個人情報を含みます。）の取扱いについて、以下のとおり定めます。
      </p>

      <div className="text-[var(--text-secondary)] leading-relaxed space-y-10">
        <section id="intro">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            1. はじめに
          </h2>
          <p>
            当社は、ユーザーのプライバシーおよび個人情報の保護を重要な責務と考えています。当社は、個人情報の保護に関する法律（個人情報保護法）その他関連法令・ガイドラインを踏まえ、適切な安全管理措置を講じます。
          </p>
        </section>

        <section id="scope">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            2. 本ポリシーの適用範囲
          </h2>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              本ポリシーは、本サービスに関して当社が取得・利用・保管する情報の取扱いに適用されます。
            </li>
            <li>
              本サービスから外部サービス（予約サイト、メール配信、アクセス解析等）へ遷移した場合、遷移先における情報の取扱いは当該第三者の規約・ポリシーに従います。
            </li>
          </ul>
        </section>

        <section id="rights">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            3. ユーザーの権利・ご請求（開示等）
          </h2>
          <p className="mb-3">
            ユーザーは、当社が保有する個人情報について、個人情報保護法の定めに従い、以下の請求を行うことができます（当社所定の本人確認を行います）。
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>利用目的の通知、開示の請求</li>
            <li>訂正・追加・削除の請求</li>
            <li>利用停止・消去、第三者提供の停止の請求</li>
            <li>
              同意に基づく処理がある場合の同意撤回（例：解析Cookieの同意等）
            </li>
          </ul>
          <p className="mt-4">
            請求方法：{' '}
            <a
              href="mailto:support@tra-bell.com"
              className="text-[var(--accent-primary)] hover:underline"
            >
              support@tra-bell.com
            </a>{' '}
            宛に、(1)氏名/登録メールアドレス、(2)請求内容、(3)本人確認資料（必要に応じて）をお送りください。
          </p>
          <p className="text-sm text-[var(--text-tertiary)] mt-2">
            ※法令上、請求に応じられない場合があります。※対応にあたり手数料が発生する場合は事前に通知します。
          </p>
        </section>

        <section id="data">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            4. 取得する情報と利用目的
          </h2>

          <section className="mt-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
              4.1 アカウント・認証情報（Googleログイン）
            </h3>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                取得情報：メールアドレス、氏名（表示名）、プロフィール画像URL、Googleの識別子、認証セッション情報（例：セッショントークン）、ログイン関連情報
              </li>
              <li>
                利用目的：本人認証、アカウント管理、不正利用防止、サポート対応
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
              4.2 Gmail連携（予約メールの検出・解析）
            </h3>
            <p className="mb-3">
              ユーザーがGmail連携を許可した場合、当社はGmail
              API（
              <code className="px-1 py-0.5 rounded bg-black/5">
                gmail.readonly
              </code>
              ）を用いて、予約確認メールを検索し、本文等から予約情報を抽出します。
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                取得・処理対象となり得る情報：予約確認メールのメッセージID、予約に関する情報（例：ホテル名、宿泊日、料金、予約番号、プラン情報、人数、キャンセル期限、施設住所・電話番号等、メールに記載の範囲）
              </li>
              <li>
                利用目的：予約情報の自動登録、予約管理、価格監視、値下がり通知、サービス改善
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
              4.3 予約・価格監視・通知に関する情報
            </h3>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                取得情報：予約情報、価格履歴、通知履歴、ユーザー設定（値下がり閾値、自動処理設定、Gmail連携状態・最終同期日時等）
              </li>
              <li>
                利用目的：価格監視、価格推移表示、通知配信、機能提供・改善、不具合調査
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
              4.4 ウェイトリスト/アンケート
            </h3>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                取得情報：メールアドレス、アンケート回答（利用OTA、OS/希望通知手段、予約タイミング等）
              </li>
              <li>
                利用目的：ウェイトリスト登録、リリース案内、ユーザー調査、サービス改善
              </li>
            </ul>
          </section>

          <section className="mt-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
              4.5 端末情報・ログ情報
            </h3>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                取得情報：IPアドレス、ユーザーエージェント、アクセス日時、操作ログ、エラーログ等
              </li>
              <li>
                利用目的：安全な運用（不正検知・防止）、障害対応、品質改善
              </li>
            </ul>
          </section>
        </section>

        <section id="how">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            5. 取得方法
          </h2>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              ユーザーが入力・送信する方法（ウェイトリスト登録、設定変更等）
            </li>
            <li>
              Googleログイン（OAuth）により取得する方法
            </li>
            <li>
              Gmail
              APIを通じてユーザーが許可した範囲で取得する方法
            </li>
            <li>
              サービス利用に伴い自動的に取得される方法（Cookie、ログ等）
            </li>
          </ul>
        </section>

        <section id="cookies">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            6. Cookie等（アクセス解析・利便性向上）
          </h2>
          <p className="mb-3">
            当社は、本サービスの提供・改善のためCookie等を使用する場合があります。
          </p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              必須/機能性Cookie：ログイン状態の維持、画面状態の保存等
            </li>
            <li>
              アクセス解析：Google Analytics、Microsoft
              Clarity
              等のツールを利用し、利用状況の分析・UX改善を行う場合があります（例：閲覧・操作情報等）。
            </li>
          </ul>
          <p className="mt-4">
            ブラウザ設定によりCookieを無効化できますが、一部機能が利用できなくなる場合があります。
          </p>
        </section>

        <section id="third">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            7. 第三者提供・委託・外部送信
          </h2>
          <p className="mb-3">
            当社は、以下の場合を除き、個人情報を第三者に提供しません。
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>
              人の生命・身体・財産の保護のために必要で本人同意が困難な場合
            </li>
            <li>
              公衆衛生の向上等のために必要で本人同意が困難な場合
            </li>
            <li>国の機関等への協力が必要な場合</li>
          </ul>

          <p className="mt-4">
            当社は、本サービス運営上、外部事業者に取扱いを委託することがあります（例：クラウドDB、ホスティング、メール配信、アクセス解析等）。委託先とは必要に応じて契約等により適切な監督を行います。
          </p>

          <div className="mt-6 rounded-2xl border border-[var(--bg-tertiary)] bg-white/60 backdrop-blur-md p-6">
            <div className="font-bold text-[var(--text-primary)] mb-3">
              主な外部サービス（例）
            </div>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                Google（Google OAuth / Gmail
                API）：ログイン、Gmail連携
              </li>
              <li>Google Analytics：アクセス解析</li>
              <li>Microsoft Clarity：アクセス解析</li>
            </ul>
          </div>
        </section>

        <section id="crossborder">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            8. 越境移転（外国にある第三者）
          </h2>
          <p>
            当社が利用する外部サービス提供者は、日本国外でデータを処理・保管する場合があります。当社は、法令に従い必要な情報提供・同意取得等を行い、適切な保護が図られるよう努めます。
          </p>
        </section>

        <section id="retention">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            9. 保有期間・削除
          </h2>
          <p className="mb-3">
            当社は、利用目的の達成に必要な期間に限り情報を保有し、目的が不要となった場合または法令上必要な保存期間経過後、合理的な方法で削除・匿名化等を行います。
          </p>
          <ul className="list-disc list-inside ml-4 space-y-2">
            <li>
              アカウント削除の申出があった場合、法令・正当な事業上の必要（不正対策、紛争対応、会計・税務等）がある範囲を除き、削除します。
            </li>
            <li>
              ウェイトリストは、配信停止等の申出があった場合、合理的な範囲で削除します。
            </li>
          </ul>
        </section>

        <section id="security">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            10. 安全管理措置
          </h2>
          <p className="mb-3">
            当社は、個人情報への不正アクセス、漏えい、滅失、毀損等を防止するため、以下を含む合理的な安全管理措置を講じます。
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>アクセス制御、権限管理</li>
            <li>通信の暗号化（TLS等）</li>
            <li>ログの監視、脆弱性対応</li>
            <li>委託先の選定・監督</li>
          </ul>
          <p className="text-sm text-[var(--text-tertiary)] mt-2">
            ※ただし、インターネット上で完全な安全を保証するものではありません。
          </p>
        </section>

        <section id="minors">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            11. 未成年者の利用
          </h2>
          <p>
            未成年者が本サービスを利用する場合は、保護者の同意を得た上で利用してください。当社が不適切な取得があったと判断した場合、合理的な範囲で削除等を行います。
          </p>
        </section>

        <section id="google">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            12. Google API（Gmail）データの取扱い（重要）
          </h2>
          <p className="mb-3">
            当社は、Gmail
            APIを通じて取得したデータについて、本サービスの機能提供（予約メールの検出・解析、予約情報の自動登録、価格監視・通知）に必要な範囲でのみ利用し、広告配信目的での利用や、不必要な第三者提供を行いません。
          </p>
          <p>
            また、当社はGoogleの定める「Google API Services
            User Data Policy（Limited
            Use要件を含む）」に従うよう努めます。
          </p>
        </section>

        <section id="changes">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            13. 本ポリシーの変更
          </h2>
          <p>
            当社は、法令改正、機能追加、運用変更等に応じて本ポリシーを改定することがあります。重要な変更がある場合は、本サービス上の掲示その他合理的な方法で周知します。
          </p>
        </section>

        <section id="dates">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            14. 制定日・改定日
          </h2>
          <div className="rounded-2xl border border-[var(--bg-tertiary)] bg-white/60 backdrop-blur-md p-6">
            <div className="space-y-2">
              <p>
                <span className="font-bold text-[var(--text-primary)]">
                  制定日
                </span>
                ：2025年12月24日
              </p>
              <p>
                <span className="font-bold text-[var(--text-primary)]">
                  最終改定日
                </span>
                ：2025年12月23日
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--bg-tertiary)]">
              <div className="font-bold text-[var(--text-primary)] mb-3">
                事業者情報・問い合わせ窓口
              </div>
              <CompanyInfo showTermsLink />
            </div>
          </div>
        </section>
      </div>
    </StaticPageLayout>
  );
}
