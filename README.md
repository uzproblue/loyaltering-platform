# Platform - Next.js Application

A Next.js application with TypeScript, Tailwind CSS, Redux Toolkit, NextAuth.js, and internationalization support.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom theme
- **Redux Toolkit** for state management
- **NextAuth.js** for authentication
- **next-intl** for internationalization (i18n)
- **Dark mode** support
- **Responsive design**

## Supported Languages

- English (en) - Default
- Spanish (es)
- French (fr)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and set:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Generate a secret key:
```bash
openssl rand -base64 32
```

**Note:** Make sure the Express server is running on port 3000 (or update `NEXT_PUBLIC_API_URL` accordingly).

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

The app will automatically redirect to `/en/sign-in` (or your default locale).

## Demo Credentials

For testing, use these credentials:
- **Email:** `demo@example.com`
- **Password:** `password`

## Authentication

The app uses **NextAuth.js** for authentication with a credentials provider. Currently, it uses an in-memory user database. In production, you should:

1. Replace the user array in `lib/auth.ts` with your actual database
2. Implement user registration
3. Add password reset functionality
4. Add email verification

### Adding New Users

To add a new user, you can use the helper function:

```typescript
import { hashPassword } from '@/lib/auth';

const hashedPassword = await hashPassword('user-password');
// Then add the user to your database with the hashed password
```

## Project Structure

```
platform/
├── app/
│   ├── [locale]/           # Locale-based routing
│   │   ├── layout.tsx      # Locale layout with providers
│   │   ├── page.tsx        # Home page
│   │   └── sign-in/        # Sign-in page
│   ├── api/
│   │   └── auth/           # NextAuth API routes
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── SignInForm.tsx      # Sign-in form component
│   ├── LanguageSwitcher.tsx # Language switcher
│   ├── SessionProvider.tsx  # NextAuth session provider
│   └── StoreProvider.tsx    # Redux store provider
├── i18n/
│   ├── config.ts           # i18n configuration
│   ├── request.ts          # i18n request config
│   └── routing.ts          # Routing configuration
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── get-session.ts       # Server session helper
│   └── store.ts            # Redux store setup
├── messages/               # Translation files
│   ├── en.json            # English translations
│   ├── es.json            # Spanish translations
│   └── fr.json            # French translations
├── store/
│   ├── slices/
│   │   └── authSlice.ts    # Auth Redux slice
│   └── hooks.ts            # Typed Redux hooks
├── types/
│   └── next-auth.d.ts      # NextAuth type definitions
└── middleware.ts           # Next.js middleware for i18n
```

## Adding New Languages

1. Add the locale to `i18n/routing.ts`:

```typescript
export const routing = defineRouting({
  locales: ['en', 'es', 'fr', 'de'], // Add 'de' for German
  defaultLocale: 'en'
});
```

2. Create a new translation file in `messages/`:

```bash
cp messages/en.json messages/de.json
```

3. Translate the content in `messages/de.json`

4. Update the middleware matcher in `middleware.ts`:

```typescript
matcher: ['/', '/(es|fr|en|de)/:path*']
```

## Redux Store

The Redux store is configured with Redux Toolkit. The auth slice manages authentication state and syncs with NextAuth session.

### Usage Example

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, logout } from '@/store/slices/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  const handleLogin = () => {
    dispatch(login({ email: 'user@example.com' }));
  };
  
  return <button onClick={handleLogin}>Login</button>;
}
```

## NextAuth Session

### Client Components

```typescript
'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'unauthenticated') return <p>Not signed in</p>;
  
  return (
    <div>
      <p>Signed in as {session?.user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

### Server Components

```typescript
import { getSession } from '@/lib/get-session';

export default async function MyPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/sign-in');
  }
  
  return <div>Welcome {session.user.email}</div>;
}
```

## Internationalization

The app uses `next-intl` for internationalization. All user-facing text should be translated.

### Using Translations

In server components:

```typescript
import { getTranslations } from 'next-intl/server';

export default async function MyPage() {
  const t = await getTranslations('signIn');
  return <h1>{t('title')}</h1>;
}
```

In client components:

```typescript
'use client';
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('signIn');
  return <h1>{t('title')}</h1>;
}
```

## Building for Production

```bash
npm run build
npm start
```

## Security Notes

- **Never commit `.env.local`** - it contains sensitive secrets
- Change `NEXTAUTH_SECRET` in production
- Replace the in-memory user database with a real database
- Implement proper password policies
- Add rate limiting for authentication endpoints
- Use HTTPS in production

## License

Private project
"# loyaltering-platform" 
