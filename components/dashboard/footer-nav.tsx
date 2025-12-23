'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BedDouble, Bell, Settings } from 'lucide-react';

const navItems = [
  {
    name: 'プラン',
    href: '/dashboard',
    icon: <BedDouble className="w-5 h-5" />,
  },
  {
    name: '通知',
    href: '/dashboard/notifications',
    icon: <Bell className="w-5 h-5" />,
  },
  {
    name: '設定',
    href: '/dashboard/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export function FooterNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--bg-tertiary)] safe-area-inset-bottom">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around px-4 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[80px] transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[var(--accent-primary)]/10 rounded-lg"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                  className={`relative z-10 ${
                    isActive
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {item.icon}
                </motion.div>
                <motion.span
                  className={`relative z-10 text-xs ${
                    isActive
                      ? 'text-[var(--accent-primary)] font-semibold'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  {item.name}
                </motion.span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
