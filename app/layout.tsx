import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';
import StoreProvider from '@/components/StoreProvider';
import SessionProvider from '@/components/SessionProvider';
import SessionErrorHandler from '@/components/SessionErrorHandler';
import LocaleProvider from '@/components/LocaleProvider';
import './globals.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get locale from cookie or default
  const locale = 'en'; // Will be handled by middleware and request.ts
  
  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/loyaltering-logo.svg" />
        <link rel="apple-touch-icon" href="/loyaltering-logo.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-background-light dark:bg-background-dark font-display text-[#141414] dark:text-white">
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <LocaleProvider>
              <StoreProvider>
                <SessionErrorHandler />
                {children}
              </StoreProvider>
            </LocaleProvider>
          </NextIntlClientProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
