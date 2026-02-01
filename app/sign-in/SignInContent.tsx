'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status, update } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const resetSuccess = searchParams.get('reset') === 'success';

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/');
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/',
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result?.ok) {
        // Force session update and wait for it to be available
        await update();
        // Wait a moment for cookies to be set server-side
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // Check user role and onboarding status before redirecting
        try {
          const profileResponse = await fetch('/api/user/profile', {
            cache: 'no-store',
          });
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const userRole = profileData.success && profileData.data?.role;
            const onboardingCompleted = profileData.success && profileData.data?.onboardingCompleted;
            
            // If user is "user" role, redirect to operator page
            if (userRole === 'user') {
              window.location.href = '/operator';
              return;
            }
            
            // Check onboarding status for admin users
            if (onboardingCompleted === false || onboardingCompleted === undefined) {
              // User hasn't completed onboarding
              window.location.href = '/onboarding';
              return;
            }
          } else {
            console.warn('Failed to fetch profile, redirecting to onboarding to be safe');
            window.location.href = '/onboarding';
            return;
          }
        } catch (error) {
          console.error('Error checking user status:', error);
          // If check fails, redirect to onboarding to be safe
          window.location.href = '/onboarding';
          return;
        }
        
        // Hard redirect to dashboard (admin user, onboarding completed)
        window.location.href = '/';
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* Left Side: Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-[#303030]">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-80"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCHo1QKy2q9FmsPoWV1lHgbipfnzz6_IDYOpnP1TZFc-kFFLf97ynAj2cjVm5EloHEv9MW7DmGiNk3AJwGpfdmrE6C-8OU17rYaYF97iN0yQojT32X3wfAyVGFlqMEIic30cVmj-apBaidED2cpZ2ILmoddkAZkjz1e-4DRj4sre-diKo1slFM_HZroygXwn8OIMp0x8XnISld8qLajV4_YXARPhjyjDdolIvGx7kM3OnEh3iysYgCXCp3vS7gxsDeRZGQ1U5mb-Q')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#303030]/80 to-transparent z-10" />

        {/* Branding Overlay */}
        <div className="relative z-20 flex items-center gap-3 text-white">
          <div className="size-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-lg">
            <img src="/loyaltering-logo.svg" alt="" className="size-6 invert" width={24} height={24} />
          </div>
          <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em]">Loyaltering</h2>
        </div>

        <div className="relative z-20 text-white max-w-md">
          <h3 className="text-3xl font-bold mb-4 tracking-tight">Elevate customer loyalty with data-driven insights.</h3>
          <p className="text-lg opacity-90 font-light">
            Join over 2,000 businesses using Loyaltering to build meaningful connections with their customers.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 bg-white dark:bg-[#121212]">
        <div className="w-full max-w-[440px] flex flex-col gap-8">
          {/* Mobile Branding (Hidden on Desktop) */}
          <div className="flex lg:hidden items-center gap-3 text-[#303030] dark:text-white mb-4">
            <img src="/loyaltering-logo.svg" alt="Loyaltering" className="size-8 dark:invert" width={32} height={32} />
            <h2 className="text-xl font-bold">Loyaltering</h2>
          </div>

          {/* Header Section */}
          <div className="flex flex-col gap-2">
            <h1 className="text-[#141414] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
              Welcome back
            </h1>
            <p className="text-[#757575] dark:text-gray-400 text-base font-normal leading-normal">
              Manage your loyalty programs and customer insights.
            </p>
          </div>

          {/* Success message after password reset */}
          {resetSuccess && (
            <div className="w-full p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-2xl border border-green-100 dark:border-green-800 text-sm">
              Your password has been reset. You can sign in with your new password.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="w-full p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm">
              {error}
            </div>
          )}

          {/* Form Section */}
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col w-full gap-2">
              <label className="text-[#141414] dark:text-white text-sm font-semibold leading-normal">Work Email</label>
              <div className="flex w-full items-stretch rounded-lg">
                <div className="text-[#757575] flex border border-r-0 border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent items-center justify-center px-4 rounded-l-lg">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#141414] dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#303030]/20 border border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent focus:border-[#303030] h-12 placeholder:text-[#757575] dark:placeholder:text-gray-500 px-4 text-sm font-normal leading-normal"
                  placeholder="name@company.com"
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col w-full gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[#141414] dark:text-white text-sm font-semibold leading-normal">Password</label>
              </div>
              <div className="flex w-full items-stretch rounded-lg">
                <div className="text-[#757575] flex border border-r-0 border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent items-center justify-center px-4 rounded-l-lg">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-none text-[#141414] dark:text-white focus:outline-0 focus:ring-0 border border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent focus:border-[#303030] h-12 placeholder:text-[#757575] dark:placeholder:text-gray-500 px-4 text-sm font-normal leading-normal"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="text-[#757575] flex border border-l-0 border-[#e0e0e0] dark:border-gray-700 bg-white dark:bg-transparent items-center justify-center px-4 rounded-r-lg"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              <div className="flex justify-end">
                <Link className="text-[#303030] dark:text-gray-300 text-xs font-medium hover:underline" href="/forgot-password">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-[#303030] dark:bg-white text-white dark:text-[#303030] text-base font-bold leading-normal tracking-[0.015em] transition-all hover:bg-black dark:hover:bg-gray-200 disabled:opacity-70"
                type="submit"
                disabled={isLoading}
              >
                <span className="truncate">{isLoading ? 'Logging in…' : 'Log In'}</span>
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="flex flex-col items-center gap-4 border-t border-[#f2f2f2] dark:border-gray-800 pt-8">
            <p className="text-[#757575] text-sm">
              Don&apos;t have an account?
              <Link className="text-[#303030] dark:text-white font-bold hover:underline ml-1" href="/register">
                Start a free trial
              </Link>
            </p>
          </div>

          {/* Footer Meta */}
          <div className="flex justify-center gap-6 mt-4">
            <Link className="text-xs text-[#757575] hover:text-[#141414] transition-colors" href="#">
              Privacy Policy
            </Link>
            <Link className="text-xs text-[#757575] hover:text-[#141414] transition-colors" href="#">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

