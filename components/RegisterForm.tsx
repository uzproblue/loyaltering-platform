'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function RegisterForm() {
  const t = useTranslations('register');
  const locale = useLocale();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    businessName: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tosAccepted) {
      setError('Please accept the Terms of Service and Privacy Policy');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // Redirect to sign-in page after successful registration
      router.push(`/${locale}/sign-in`);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {/* Full Name */}
      <div className="flex flex-col gap-2">
        <label className="text-[#141414] dark:text-gray-200 text-base font-medium leading-normal">
          {t('fullNameLabel')}
        </label>
        <input
          className="form-input flex w-full min-w-0 flex-1 rounded-lg text-[#141414] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary border border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent h-14 placeholder:text-[#757575] dark:placeholder:text-gray-500 px-4 text-base font-normal"
          placeholder={t('fullNamePlaceholder')}
          required
          type="text"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
        />
      </div>

      {/* Work Email */}
      <div className="flex flex-col gap-2">
        <label className="text-[#141414] dark:text-gray-200 text-base font-medium leading-normal">
          {t('emailLabel')}
        </label>
        <input
          className="form-input flex w-full min-w-0 flex-1 rounded-lg text-[#141414] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary border border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent h-14 placeholder:text-[#757575] dark:placeholder:text-gray-500 px-4 text-base font-normal"
          placeholder={t('emailPlaceholder')}
          required
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
      </div>

      {/* Business Name */}
      <div className="flex flex-col gap-2">
        <label className="text-[#141414] dark:text-gray-200 text-base font-medium leading-normal">
          {t('businessNameLabel')}
        </label>
        <input
          className="form-input flex w-full min-w-0 flex-1 rounded-lg text-[#141414] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary border border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent h-14 placeholder:text-[#757575] dark:placeholder:text-gray-500 px-4 text-base font-normal"
          placeholder={t('businessNamePlaceholder')}
          required
          type="text"
          value={formData.businessName}
          onChange={(e) =>
            setFormData({ ...formData, businessName: e.target.value })
          }
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2 relative">
        <label className="text-[#141414] dark:text-gray-200 text-base font-medium leading-normal">
          {t('passwordLabel')}
        </label>
        <div className="relative">
          <input
            className="form-input flex w-full min-w-0 flex-1 rounded-lg text-[#141414] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary border border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent h-14 placeholder:text-[#757575] dark:placeholder:text-gray-500 px-4 pr-12 text-base font-normal"
            placeholder={t('passwordPlaceholder')}
            required
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] dark:text-gray-400 hover:text-[#141414] dark:hover:text-white transition-colors"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <span className="material-symbols-outlined text-xl">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      </div>

      {/* TOS Checkbox */}
      <div className="flex items-start gap-3 py-2">
        <input
          className="mt-1 size-5 rounded border-[#e0e0e0] dark:border-gray-700 text-primary focus:ring-primary bg-white dark:bg-transparent"
          id="tos"
          type="checkbox"
          checked={tosAccepted}
          onChange={(e) => setTosAccepted(e.target.checked)}
          required
        />
        <label
          className="text-sm leading-normal text-[#141414] dark:text-gray-300"
          htmlFor="tos"
        >
          {t('tosAgreement')}{' '}
          <a className="font-bold underline" href="#">
            {t('termsOfService')}
          </a>{' '}
          {t('and')}{' '}
          <a className="font-bold underline" href="#">
            {t('privacyPolicy')}
          </a>
          .
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary dark:bg-white text-white dark:text-primary text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 dark:hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={isLoading}
      >
        <span>{isLoading ? 'Creating Account...' : t('submitButton')}</span>
      </button>
    </form>
  );
}

