'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { setStoredLocale } from '@/lib/locale';

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  useEffect(() => {
    // Sync locale to localStorage whenever it changes
    setStoredLocale(locale);
    
    // Also set cookie for server-side access
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  }, [locale]);

  return <>{children}</>;
}

