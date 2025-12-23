import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[var(--bg-tertiary)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logos/logo.png"
            alt="Tra-bell"
            width={1240}
            height={400}
            className="h-12 w-auto object-contain"
          />
        </Link>
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/terms"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              利用規約
            </Link>
          </div>
          <div className="hidden md:block">|</div>
          <div>© 2025 Tra-bell All rights reserved.</div>
          <div className="hidden md:block">|</div>
          <div>
            運営会社:{' '}
            <a
              href="https://www.smile-comfort.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-primary)] hover:underline"
            >
              合同会社スマイルコンフォート
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
