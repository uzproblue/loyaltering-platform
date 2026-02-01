'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function RegisterContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    password: '',
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreeToTerms) {
      setError('Please accept the Terms of Service to continue.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          businessName: formData.businessName,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      // Wait a moment for the user to be fully saved in the database
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Auto-login after successful registration
      try {
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (signInResult?.error) {
          console.error('Auto-login error:', signInResult.error);
          setError(`Registration successful, but auto-login failed: ${signInResult.error}. Please sign in manually.`);
          setIsLoading(false);
          // Still redirect to sign-in after a delay
          setTimeout(() => {
            router.push('/sign-in');
          }, 2000);
          return;
        } else if (signInResult?.ok) {
          // Wait a moment for session to be set
          await new Promise((resolve) => setTimeout(resolve, 500));
          // Redirect to onboarding (new users haven't completed onboarding)
          window.location.href = '/onboarding';
          return;
        }
      } catch (loginError: any) {
        console.error('Auto-login exception:', loginError);
        setError(`Registration successful, but auto-login failed: ${loginError?.message || 'Unknown error'}. Please sign in manually.`);
        setIsLoading(false);
        // Still redirect to sign-in after a delay
        setTimeout(() => {
          router.push('/sign-in');
        }, 2000);
        return;
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Side: Visual/Hero Section */}
      <div className="relative hidden w-full lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuArMgHHDbphAgZxH3JVbyRtY-NL5CEg4SVRuk0pi4kM8mgpLulvUq1-VSR7ldPVt4hfSebPvWUshWhI8nDds5alnIMYkJf4V0tSJBeqXbC9Aq_6ukcQA6pABqRaMIUkGUFYDexlXS4IR4AXSBriqWaU2ZyCjVpHu1e-YsUgClidF1pbb3PtlhFB-jbfTSiKMsix_Q3Gv-JAYkgXxVpgkQou4lFi8hY8l-0Xi-L4eFgOlFqa0t7mWSpJ-G-BGGsmaPtRpp5VgywL3Q")',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Logo Overlay */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-12 text-center">
          <div className="flex items-center gap-3 text-white">
            <div className="size-10 flex items-center justify-center">
              <img src="/loyaltering-logo.svg" alt="" className="size-10 invert" width={40} height={40} />
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-[-0.033em]">Loyaltering</h1>
          </div>
          <h2 className="max-w-md text-xl font-medium text-white/90">
            Empowering modern businesses with smart loyalty solutions.
          </h2>
        </div>
      </div>

      {/* Right Side: Registration Form Section */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-20 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-[480px]">
          {/* Top Header (mobile) */}
          <div className="flex items-center justify-between mb-10 lg:hidden">
            <div className="flex items-center gap-2">
              <img src="/loyaltering-logo.svg" alt="Loyaltering" className="size-6 dark:invert" width={24} height={24} />
              <span className="text-lg font-bold">Loyaltering</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-[#141414] dark:text-white text-3xl font-bold leading-tight tracking-[-0.015em]">
              Create your business account
            </h2>
            <p className="text-sm text-[#757575] dark:text-gray-400 mt-2">
              Join thousands of businesses growing with Loyaltering.
            </p>
          </div>

          {error && (
            <div className="w-full p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm mb-5">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[#141414] dark:text-gray-200 text-base font-medium leading-normal">Full Name</label>
              <input
                className="form-input flex w-full min-w-0 flex-1 rounded-lg text-[#141414] focus:border-primary focus:ring-1 focus:ring-primary border border-[#e0e0e0] bg-white dark:bg-transparent dark:text-white dark:border-gray-700 h-14 placeholder:text-[#757575] dark:placeholder:text-gray-500 px-4 text-base font-normal"
                placeholder="e.g. Jane Doe"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Work Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[#141414] dark:text-gray-200 text-base font-medium leading-normal">Work Email</label>
              <input
                className="form-input flex w-full min-w-0 flex-1 rounded-lg text-[#141414] focus:border-primary focus:ring-1 focus:ring-primary border border-[#e0e0e0] bg-white dark:bg-transparent dark:text-white dark:border-gray-700 h-14 placeholder:text-[#757575] dark:placeholder:text-gray-500 px-4 text-base font-normal"
                placeholder="name@company.com"
                type="email"
                autoComplete="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Business Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[#141414] dark:text-gray-200 text-base font-medium leading-normal">Business Name</label>
              <input
                className="form-input flex w-full min-w-0 flex-1 rounded-lg text-[#141414] focus:border-primary focus:ring-1 focus:ring-primary border border-[#e0e0e0] bg-white dark:bg-transparent dark:text-white dark:border-gray-700 h-14 placeholder:text-[#757575] dark:placeholder:text-gray-500 px-4 text-base font-normal"
                placeholder="Your Store Name"
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2 relative">
              <label className="text-[#141414] dark:text-gray-200 text-base font-medium leading-normal">Password</label>
              <div className="relative">
                <input
                  className="form-input flex w-full min-w-0 flex-1 rounded-lg text-[#141414] focus:border-primary focus:ring-1 focus:ring-primary border border-[#e0e0e0] bg-white dark:bg-transparent dark:text-white dark:border-gray-700 h-14 placeholder:text-[#757575] dark:placeholder:text-gray-500 px-4 text-base font-normal pr-12"
                  placeholder="Min. 8 characters"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#757575]"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* TOS Checkbox */}
            <div className="flex items-start gap-3 py-2">
              <input
                className="mt-1 size-5 rounded border-[#e0e0e0] text-primary focus:ring-primary bg-white dark:bg-transparent dark:border-gray-700"
                id="tos"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label className="text-sm leading-normal text-[#141414] dark:text-gray-300" htmlFor="tos">
                I agree to the{' '}
                <Link className="font-bold underline" href="#">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link className="font-bold underline" href="#">
                  Datenschutz (GDPR)
                </Link>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              <span>{isLoading ? 'Creating…' : 'Create Account'}</span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-[#757575] dark:text-gray-400">
              Already have an account?
              <Link className="font-bold text-[#141414] dark:text-white hover:underline ml-1" href="/sign-in">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

