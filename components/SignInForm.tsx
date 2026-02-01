'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';

export default function SignInForm() {
  const t = useTranslations('signIn');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        // Update Redux store
        dispatch(login({ email, name: email.split('@')[0] }));
        // Redirect to home or dashboard
        router.push('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {/* Email Field */}
      <div className="flex flex-col w-full gap-2">
        <label className="text-[#141414] dark:text-white text-sm font-semibold leading-normal">
          {t('emailLabel')}
        </label>
        <div className="flex w-full items-stretch rounded-lg">
          <div className="text-[#757575] flex border border-r-0 border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent items-center justify-center px-4 rounded-l-lg">
            <span className="material-symbols-outlined text-[20px]">mail</span>
          </div>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#141414] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent focus:border-primary h-12 placeholder:text-[#757575] dark:placeholder:text-gray-500 px-4 text-sm font-normal leading-normal"
            placeholder={t('emailPlaceholder')}
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="flex flex-col w-full gap-2">
        <div className="flex justify-between items-center">
          <label className="text-[#141414] dark:text-white text-sm font-semibold leading-normal">
            {t('passwordLabel')}
          </label>
        </div>
        <div className="flex w-full items-stretch rounded-lg">
          <div className="text-[#757575] flex border border-r-0 border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent items-center justify-center px-4 rounded-l-lg">
            <span className="material-symbols-outlined text-[20px]">lock</span>
          </div>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-none text-[#141414] dark:text-white focus:outline-0 focus:ring-0 border border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent focus:border-primary h-12 placeholder:text-[#757575] dark:placeholder:text-gray-500 px-4 text-sm font-normal leading-normal"
            placeholder={t('passwordPlaceholder')}
            required
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="text-[#757575] flex border border-l-0 border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent items-center justify-center px-4 rounded-r-lg hover:text-[#141414] dark:hover:text-white transition-colors"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
        <div className="flex justify-end">
          <a
            className="text-primary dark:text-gray-300 text-xs font-medium hover:underline"
            href="#"
          >
            {t('forgotPassword')}
          </a>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Login Button */}
      <div className="pt-2">
        <button
          className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary dark:bg-white text-white dark:text-primary text-base font-bold leading-normal tracking-[0.015em] transition-all hover:bg-black dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          <span className="truncate">
            {isLoading ? 'Signing in...' : t('submitButton')}
          </span>
        </button>
      </div>
    </form>
  );
}

