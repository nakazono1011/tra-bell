import { Navbar } from './navbar';
import { Footer } from './footer';

interface StaticPageLayoutProps {
  children: React.ReactNode;
}

export function StaticPageLayout({
  children,
}: StaticPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden selection:bg-[var(--accent-primary)] selection:text-[var(--text-on-accent)]">
      <Navbar />
      <main className="pt-20 lg:pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
