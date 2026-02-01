'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { setStoredLocale } from '@/lib/locale';

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const handleLanguageChange = async (newLocale: string) => {
    // Save to localStorage
    setStoredLocale(newLocale);
    
    // Set cookie via API route
    await fetch('/api/locale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locale: newLocale }),
    });
    
    // Reload page to apply new locale
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLanguageChange(loc)}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            locale === loc
              ? 'bg-primary dark:bg-white text-white dark:text-primary'
              : 'text-[#757575] dark:text-gray-400 hover:text-[#141414] dark:hover:text-white'
          }`}
        >
          {languageNames[loc]}
        </button>
      ))}
    </div>
  );
}
