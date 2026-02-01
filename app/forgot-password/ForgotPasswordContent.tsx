'use client';

import { useState } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/lib/api';

export default function ForgotPasswordContent() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSent(false);
    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email.trim());
      if (result.success) {
        setSent(true);
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f1f1f1] dark:bg-background-dark min-h-screen flex flex-col font-display">
      {/* TopNavBar Simplified */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e0e0e0] dark:border-white/10 px-10 py-4 bg-white dark:bg-background-dark/50 backdrop-blur-sm">
        <div className="flex items-center gap-4 text-primary dark:text-white">
          <img src="/loyaltering-logo.svg" alt="Loyaltering" className="size-6 dark:invert" width={24} height={24} />
          <h2 className="text-primary dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">Loyaltering</h2>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {/* Central Recovery Card */}
        <div className="w-full max-w-[480px] bg-white dark:bg-background-dark border border-[#e0e0e0] dark:border-white/10 rounded-xl shadow-sm overflow-hidden p-8 md:p-10">
          {/* Headline */}
          <div className="flex flex-col items-center">
            <div className="mb-6 rounded-full bg-primary/5 dark:bg-white/10 p-4 text-primary dark:text-white">
              <span className="material-symbols-outlined !text-4xl">lock_reset</span>
            </div>
            <h1 className="text-primary dark:text-white tracking-tight text-[28px] md:text-[32px] font-bold leading-tight text-center pb-3">
              Reset your password
            </h1>
          </div>

          <p className="text-[#4a4a4a] dark:text-gray-400 text-base font-normal leading-relaxed pb-8 text-center max-w-[360px] mx-auto">
            Enter the email address associated with your Loyaltering account and we’ll send you a link to reset your password.
          </p>

          {error && (
            <div className="w-full p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm mb-6">
              {error}
            </div>
          )}

          {sent && (
            <div className="w-full p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm mb-6">
              If an account exists for that email, we sent a reset link.
            </div>
          )}

          {/* Form Section */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="flex flex-col w-full">
                <p className="text-primary dark:text-gray-200 text-sm font-semibold leading-normal pb-2">Work Email</p>
                <input
                  className="form-input flex w-full rounded-lg text-primary dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#e0e0e0] dark:border-white/20 bg-white dark:bg-background-dark/50 focus:border-primary h-14 placeholder:text-[#a0a0a0] px-4 text-base font-normal leading-normal transition-all"
                  placeholder="name@company.com"
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>

            <div className="pt-2">
              <button
                className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-5 bg-primary dark:bg-white dark:text-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-black dark:hover:bg-gray-100 transition-colors disabled:opacity-70"
                type="submit"
                disabled={isLoading}
              >
                <span className="truncate">{isLoading ? 'Sending…' : 'Send Reset Link'}</span>
              </button>
            </div>
          </form>

          {/* Navigation Link */}
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
      </main>

      {/* Simple Footer */}
      <footer className="py-8 text-center">
        <p className="text-xs text-[#a0a0a0] font-normal uppercase tracking-widest">
          © 2024 Loyaltering Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

