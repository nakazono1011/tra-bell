import Link from 'next/link';
import Image from 'next/image';
import { navLinks } from './constants';

export function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass-panel border-b-0 h-16 px-6 lg:px-12 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight flex items-center gap-2"
        >
          <Image
            src="/logos/logo.png"
            alt="Tra-bell"
            width={1240}
            height={400}
            className="h-16 w-auto object-contain"
            priority
          />
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#waitlist"
            className="text-sm font-bold bg-[var(--accent-primary)] text-[var(--text-on-accent)] px-5 py-2.5 rounded-full hover:bg-[var(--accent-hover)] transition-colors shadow-sm"
          >
            無料で始める
          </a>
        </div>
        <div className="md:hidden">
          <a
            href="/#waitlist"
            className="text-sm font-bold bg-[var(--accent-primary)] text-[var(--text-on-accent)] px-4 py-2 rounded-full hover:bg-[var(--accent-hover)] transition-colors"
          >
            無料で始める
          </a>
        </div>
      </div>
    </nav>
  );
}
