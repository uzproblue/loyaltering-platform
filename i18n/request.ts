import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async () => {
  // Try to get locale from cookie first
  let locale = (await cookies()).get('NEXT_LOCALE')?.value;
  
  // If no cookie, try to get from Accept-Language header
  if (!locale) {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
      if (routing.locales.includes(preferredLocale as any)) {
        locale = preferredLocale;
      }
    }
  }

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Cookie will be set by client-side LocaleProvider component
  // We can't set cookies here in server components

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
