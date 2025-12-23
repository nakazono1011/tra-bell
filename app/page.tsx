'use client';

import { Navbar } from '@/components/landing/navbar';
import { HeroSection } from '@/components/landing/hero-section';
import { ProblemSection } from '@/components/landing/problem-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { CTASection } from '@/components/landing/cta-section';
import { FAQSection } from '@/components/landing/faq-section';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] overflow-x-hidden selection:bg-[var(--accent-primary)] selection:text-[var(--text-on-accent)]">
      <Navbar />
      <main className="pt-20 lg:pt-32">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
