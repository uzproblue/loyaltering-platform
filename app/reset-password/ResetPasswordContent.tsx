'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(token, newPassword);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/sign-in?reset=success');
        }, 1500);
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-[480px] bg-white dark:bg-background-dark border border-[#e0e0e0] dark:border-white/10 rounded-xl shadow-sm overflow-hidden p-8 md:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400">
            <span className="material-symbols-outlined !text-4xl">link_off</span>
          </div>
          <h1 className="text-primary dark:text-white text-[28px] md:text-[32px] font-bold leading-tight pb-3">
            Invalid or missing reset link
          </h1>
          <p className="text-[#4a4a4a] dark:text-gray-400 text-base pb-8">
            This link is invalid or has expired. Please request a new password reset.
          </p>
          <Link
            className="inline-flex items-center gap-2 rounded-lg h-14 px-6 bg-primary dark:bg-white dark:text-primary text-white text-base font-bold hover:bg-black dark:hover:bg-gray-100 transition-colors"
            href="/forgot-password"
          >
            Request new reset link
          </Link>
          <Link
            className="mt-6 flex items-center gap-2 text-sm font-medium text-[#4a4a4a] dark:text-gray-400 hover:text-primary dark:hover:text-white"
            href="/sign-in"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-[480px] bg-white dark:bg-background-dark border border-[#e0e0e0] dark:border-white/10 rounded-xl shadow-sm overflow-hidden p-8 md:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-green-500/10 p-4 text-green-600 dark:text-green-400">
            <span className="material-symbols-outlined !text-4xl">check_circle</span>
          </div>
          <h1 className="text-primary dark:text-white text-[28px] md:text-[32px] font-bold leading-tight pb-3">
            Password reset successfully
          </h1>
          <p className="text-[#4a4a4a] dark:text-gray-400 text-base">
            Redirecting you to sign in…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[480px] bg-white dark:bg-background-dark border border-[#e0e0e0] dark:border-white/10 rounded-xl shadow-sm overflow-hidden p-8 md:p-10">
      <div className="flex flex-col items-center pb-6">
        <div className="mb-6 rounded-full bg-primary/5 dark:bg-white/10 p-4 text-primary dark:text-white">
          <span className="material-symbols-outlined !text-4xl">lock_reset</span>
        </div>
        <h1 className="text-primary dark:text-white tracking-tight text-[28px] md:text-[32px] font-bold leading-tight text-center pb-3">
          Set new password
        </h1>
      </div>

      <p className="text-[#4a4a4a] dark:text-gray-400 text-base pb-8 text-center">
        Enter your new password below.
      </p>

      {error && (
        <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800 text-sm mb-6">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="flex flex-col w-full">
            <p className="text-primary dark:text-gray-200 text-sm font-semibold leading-normal pb-2">New password</p>
            <input
              className="form-input flex w-full rounded-lg text-primary dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#e0e0e0] dark:border-white/20 bg-white dark:bg-background-dark/50 focus:border-primary h-14 placeholder:text-[#a0a0a0] px-4 text-base font-normal leading-normal transition-all"
              placeholder="Min. 8 characters"
              required
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex flex-col w-full">
            <p className="text-primary dark:text-gray-200 text-sm font-semibold leading-normal pb-2">Confirm password</p>
            <input
              className="form-input flex w-full rounded-lg text-primary dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#e0e0e0] dark:border-white/20 bg-white dark:bg-background-dark/50 focus:border-primary h-14 placeholder:text-[#a0a0a0] px-4 text-base font-normal leading-normal transition-all"
              placeholder="Confirm new password"
              required
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="show-password"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
            className="rounded border-[#e0e0e0] text-primary focus:ring-primary/20"
          />
          <label htmlFor="show-password" className="text-sm text-[#4a4a4a] dark:text-gray-400">
            Show password
          </label>
        </div>
        <div className="pt-2">
          <button
            className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary dark:bg-white dark:text-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-black dark:hover:bg-gray-100 transition-colors disabled:opacity-70"
            type="submit"
            disabled={isLoading}
          >
            <span className="truncate">{isLoading ? 'Resetting…' : 'Reset password'}</span>
          </button>
        </div>
      </form>

      <div className="mt-10 flex justify-center">
        <Link
          className="flex items-center gap-2 text-sm font-medium text-[#4a4a4a] dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors"
          href="/sign-in"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordContent() {
  return (
    <div className="bg-[#f1f1f1] dark:bg-background-dark min-h-screen flex flex-col font-display">
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e0e0e0] dark:border-white/10 px-10 py-4 bg-white dark:bg-background-dark/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 text-primary dark:text-white">
          <img src="/loyaltering-logo.svg" alt="Loyaltering" className="size-6 dark:invert" width={24} height={24} />
          <h2 className="text-primary dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Loyaltering</h2>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={
          <div className="w-full max-w-[480px] bg-white dark:bg-background-dark border border-[#e0e0e0] dark:border-white/10 rounded-xl shadow-sm p-8 md:p-10 text-center text-[#4a4a4a] dark:text-gray-400">
            Loading…
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </main>

      <footer className="py-8 text-center">
        <p className="text-xs text-[#a0a0a0] font-normal uppercase tracking-widest">
          © 2024 Loyaltering Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
