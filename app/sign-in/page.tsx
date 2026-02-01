import { Suspense } from 'react';
import SignInContent from './SignInContent';

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#121212]">Loading…</div>}>
      <SignInContent />
    </Suspense>
  );
}

