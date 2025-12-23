import Link from 'next/link';

interface CompanyInfoProps {
  showTermsLink?: boolean;
}

export function CompanyInfo({
  showTermsLink = false,
}: CompanyInfoProps) {
  return (
    <ul className="list-none space-y-2 ml-4">
      <li>
        <strong>事業者名</strong>
        ：合同会社スマイルコンフォート
      </li>
      <li>
        <strong>所在地</strong>
        ：東京都目黒区下目黒１丁目１番１４号
        コノトラビル７Ｆ
      </li>
      <li>
        <strong>代表者</strong>：中園 啓佑
      </li>
      <li>
        <strong>お問い合わせ</strong>：
        <a
          href="mailto:support@tra-bell.com"
          className="text-[var(--accent-primary)] hover:underline"
        >
          support@tra-bell.com
        </a>
      </li>
      {showTermsLink && (
        <li className="text-sm text-[var(--text-tertiary)] pt-2">
          <Link
            href="/terms"
            className="text-[var(--accent-primary)] hover:underline"
          >
            利用規約はこちら
          </Link>
        </li>
      )}
    </ul>
  );
}
