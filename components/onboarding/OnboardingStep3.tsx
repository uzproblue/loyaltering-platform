'use client';

import { useState } from 'react';

export const ONBOARDING_PENDING_KEY = 'onboarding_pending';

export interface OnboardingPendingData {
  businessName: string;
  category: string;
  plan: string;
  billingCycle: 'Monthly' | 'Yearly';
}

interface OnboardingStep3Props {
  onSubmit?: (data: {
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    billingAddressSame: boolean;
  }) => void;
  onBack: () => void;
  selectedPlan?: {
    name: string;
    price: number;
    billingCycle: 'Monthly' | 'Yearly';
  };
  /** Persisted before redirect to Stripe so success page can complete onboarding */
  onboardingDataForSuccess?: OnboardingPendingData;
}

export default function OnboardingStep3({ onBack, selectedPlan, onboardingDataForSuccess }: OnboardingStep3Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = selectedPlan || {
    name: 'Professional',
    price: 99,
    billingCycle: 'Monthly' as 'Monthly' | 'Yearly',
  };

  const planId = plan.name.toLowerCase();
  const subtotal = plan.price;
  const tax = 0;
  const total = subtotal + tax;

  const handleContinueToPayment = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          plan: planId,
          billingCycle: plan.billingCycle,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to start checkout');
        setLoading(false);
        return;
      }
      if (data.url) {
        if (onboardingDataForSuccess && typeof window !== 'undefined') {
          sessionStorage.setItem(ONBOARDING_PENDING_KEY, JSON.stringify(onboardingDataForSuccess));
        }
        window.location.href = data.url;
        return;
      }
      setError('No checkout URL returned');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex flex-col gap-3 max-w-[960px] mx-auto">
          <div className="flex gap-6 justify-between">
            <p className="text-[#141414] dark:text-white text-base font-medium leading-normal">
              Onboarding Progress
            </p>
            <p className="text-[#141414] dark:text-white text-sm font-normal leading-normal">
              Step 3 of 4
            </p>
          </div>
          <div className="rounded bg-[#e0e0e0] dark:bg-[#333]">
            <div className="h-2 rounded bg-primary dark:bg-white" style={{ width: '75%' }}></div>
          </div>
          <p className="text-[#757575] dark:text-[#a0a0a0] text-sm font-normal leading-normal">
            Almost there! Setting up your billing details.
          </p>
        </div>
      </div>

      {/* Page Heading */}
      <div className="flex flex-wrap justify-between gap-3 mb-8 max-w-[960px] mx-auto">
        <div className="flex min-w-72 flex-col gap-2">
          <p className="text-[#141414] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
            Billing & Payment
          </p>
          <p className="text-[#757575] dark:text-[#a0a0a0] text-base font-normal leading-normal">
            Securely link your payment method to activate your loyalty program.
          </p>
        </div>
      </div>

      {/* Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-[960px] mx-auto">
        {/* Left Column: Payment CTA */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e0e0] dark:border-[#333] rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[#141414] dark:text-white tracking-light text-xl font-bold leading-tight">
                Payment
              </h3>
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-[#757575] dark:text-[#a0a0a0]">lock</span>
                <span className="text-xs text-[#757575] dark:text-[#a0a0a0] font-medium self-center">
                  SECURE
                </span>
              </div>
            </div>
            <p className="text-[#757575] dark:text-[#a0a0a0] text-sm leading-relaxed mb-6">
              You will be redirected to Stripe Checkout to enter your payment details securely. We do not store your card number.
            </p>
            {error && (
              <p className="text-sm text-red-500 mb-4" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Stripe Branding */}
          <div className="flex items-center justify-center gap-4 py-4 text-[#757575]">
            <span className="text-xs">Payments secured by</span>
            <div className="flex items-center gap-1 font-bold text-lg">
              <span className="material-symbols-outlined text-blue-500">payments</span>
              <span className="tracking-tight text-primary dark:text-white">stripe</span>
            </div>
          </div>
        </div>

        {/* Right Column: Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e0e0] dark:border-[#333] rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="text-[#141414] dark:text-white text-lg font-bold mb-4">Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-[#141414] dark:text-white">{plan.name} Plan</p>
                  <p className="text-xs text-[#757575]">
                    Billed {plan.billingCycle.toLowerCase()}
                  </p>
                </div>
                <p className="text-sm font-bold text-[#141414] dark:text-white">€{plan.price.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#f2f2f2] dark:border-[#333]">
                <p className="text-sm text-[#757575]">Subtotal</p>
                <p className="text-sm text-[#141414] dark:text-white">€{subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#757575]">Tax (0%)</p>
                <p className="text-sm text-[#141414] dark:text-white">€{tax.toFixed(2)}</p>
              </div>
            </div>
            <div className="bg-[#f7f7f7] dark:bg-[#2a2a2a] rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <p className="text-base font-bold text-[#141414] dark:text-white">Total due today</p>
                <p className="text-xl font-black text-[#141414] dark:text-white">€{total.toFixed(2)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleContinueToPayment}
              disabled={loading}
              className="w-full h-14 bg-primary hover:bg-[#404040] transition-colors rounded-lg text-white text-base font-bold tracking-[0.015em] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Redirecting…</span>
                </>
              ) : (
                <>
                  <span>Continue to payment</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
            <p className="mt-4 text-[10px] text-[#757575] text-center leading-relaxed">
              By clicking &quot;Continue to payment&quot;, you agree to Loyaltering&apos;s{' '}
              <a className="underline hover:opacity-80 transition-opacity" href="#">
                Terms of Service
              </a>{' '}
              and{' '}
              <a className="underline hover:opacity-80 transition-opacity" href="#">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="max-w-[960px] mx-auto mt-12 flex items-center justify-between border-t border-[#e0e0e0] dark:border-[#333] pt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[#757575] hover:text-primary dark:hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span className="text-sm font-medium">Back to plan selection</span>
        </button>
        <p className="text-xs text-[#757575]">
          Need help?{' '}
          <a className="font-bold underline hover:opacity-80 transition-opacity" href="#">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
