'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

export default function SessionErrorHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If session loading fails or becomes invalid, redirect to sign-in
    // Don't redirect if we're on public pages (sign-in, register, forgot-password)
    // Also don't redirect while loading to avoid race conditions
    const publicPages = ['/sign-in', '/register', '/forgot-password', '/reset-password'];
    if (
      status === 'unauthenticated' &&
      !publicPages.includes(pathname) &&
      status !== 'loading'
    ) {
      router.push('/sign-in');
    }
  }, [status, router, pathname]);

  return null;
}

