'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNavbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '/home';
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/search', icon: 'search', label: 'Search' },
    { href: '/history', icon: 'receipt_long', label: 'Orders' },
    { href: '/saved', icon: 'bookmark', label: 'Saved' },
    { href: '/profile', icon: 'person', label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface-light dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 px-2 pb-6 pt-2 z-40">
      <div className="flex justify-between items-end">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-end gap-1 transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-text-sub-light dark:text-text-sub-dark hover:text-primary'
              }`}
            >
              <div
                className={`flex h-8 items-center justify-center ${
                  active ? 'w-14 rounded-full bg-primary/20' : ''
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    active ? 'font-bold' : ''
                  }`}
                >
                  {item.icon}
                </span>
              </div>
              <p
                className={`text-[10px] font-medium transition-colors ${
                  active ? 'font-bold text-primary' : ''
                }`}
              >
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
