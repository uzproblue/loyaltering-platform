'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import OnboardingStep1 from '@/components/onboarding/OnboardingStep1';
import OnboardingStep2 from '@/components/onboarding/OnboardingStep2';
import OnboardingStep3 from '@/components/onboarding/OnboardingStep3';
import OnboardingStep4 from '@/components/onboarding/OnboardingStep4';

export default function OnboardingContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);

  // Check if onboarding was skipped in this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const skipped = sessionStorage.getItem('onboarding_skipped');
      if (skipped === 'true') {
        // Redirect to dashboard if skipped in this session
        router.push('/');
      }
    }
  }, [router]);
  const [onboardingData, setOnboardingData] = useState({
    businessName: '',
    category: '',
    locations: '',
    country: '',
    plan: '',
    billingCycle: 'Monthly' as 'Monthly' | 'Yearly',
  });

  const handleSignOut = async () => {
    // Clear onboarding skip flag so onboarding shows again on next login
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('onboarding_skipped');
    }
    await signOut({ redirect: false });
    router.push('/sign-in');
  };

  const handleStep1Submit = async (data: {
    businessName: string;
    category: string;
    locations: string;
    country: string;
  }) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    // Move to step 2 instead of completing
    setCurrentStep(2);
  };

  const handleStep2Submit = async (data: { plan: string; billingCycle: 'Monthly' | 'Yearly' }) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    // Move to step 3 instead of completing
    setCurrentStep(3);
  };

  const handleStep3Submit = async (data: {
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    billingAddressSame: boolean;
  }) => {
    // Move to step 4 instead of completing
    setCurrentStep(4);
  };

  const handleStep4Complete = async () => {
    // Save onboarding data and mark as completed
    try {
      const response = await fetch('/api/user/onboarding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          onboardingCompleted: true,
          businessName: onboardingData.businessName,
          category: onboardingData.category,
          locations: onboardingData.locations,
          country: onboardingData.country,
          plan: onboardingData.plan,
          billingCycle: onboardingData.billingCycle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save onboarding data');
      }

      // Navigate to dashboard
      window.location.href = '/';
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      // Still navigate to dashboard even if save fails
      router.push('/');
    }
  };

  const handleExploreLater = async () => {
    // Same as complete - mark as done and go to dashboard
    await handleStep4Complete();
  };

  const handleSkip = async () => {
    // Mark onboarding as skipped for this session only (not in database)
    // This way, onboarding will show again on next login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('onboarding_skipped', 'true');
    }
    
    // Navigate to dashboard without marking onboarding as completed
    window.location.href = '/';
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e0e0e0] dark:border-[#333] bg-white dark:bg-background-dark px-10 py-3">
        <div className="flex items-center gap-4 text-primary dark:text-white">
          <img src="/loyaltering-logo.svg" alt="Loyaltering" className="size-6 dark:invert" width={24} height={24} />
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Loyaltering</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#757575] hidden sm:block">Need help?</span>
          <button
            onClick={handleSignOut}
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold transition-opacity hover:opacity-90"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 flex justify-center py-10 px-4 sm:px-10">
        {currentStep === 1 && (
          <OnboardingStep1 onSubmit={handleStep1Submit} onSkip={handleSkip} />
        )}
        {currentStep === 2 && (
          <OnboardingStep2
            onSubmit={handleStep2Submit}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <OnboardingStep3
            onSubmit={handleStep3Submit}
            onBack={() => setCurrentStep(2)}
            selectedPlan={
              onboardingData.plan
                ? {
                    name: onboardingData.plan.charAt(0).toUpperCase() + onboardingData.plan.slice(1),
                    price: onboardingData.plan === 'basic' ? 49 : onboardingData.plan === 'professional' ? 99 : 249,
                    billingCycle: onboardingData.billingCycle,
                  }
                : undefined
            }
          />
        )}
        {currentStep === 4 && (
          <OnboardingStep4
            onComplete={handleStep4Complete}
            onExploreLater={handleExploreLater}
          />
        )}
      </main>

      {/* Simple footer */}
      <footer className="py-6 px-10 border-t border-[#e0e0e0] dark:border-[#333] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#757575] text-xs">© { new Date().getFullYear() } CMUS SaaS Platform. All rights reserved.</p>
        <div className="flex gap-4">
          <a className="text-[#757575] hover:text-primary dark:hover:text-white text-xs transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="text-[#757575] hover:text-primary dark:hover:text-white text-xs transition-colors" href="#">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}

