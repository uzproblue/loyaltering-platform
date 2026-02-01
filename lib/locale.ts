// Client-side locale utilities
export const LOCALE_STORAGE_KEY = 'app-locale';

export function getStoredLocale(): string {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem(LOCALE_STORAGE_KEY) || 'en';
}

export function setStoredLocale(locale: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function isValidLocale(locale: string): boolean {
  return ['en', 'es', 'fr'].includes(locale);
}

