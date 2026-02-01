'use client';

import { useState } from 'react';

interface OnboardingStep2Props {
  onSubmit: (data: { plan: string; billingCycle: 'Monthly' | 'Yearly' }) => void;
  onBack: () => void;
}

export default function OnboardingStep2({ onSubmit, onBack }: OnboardingStep2Props) {
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleSubmit = () => {
    if (selectedPlan) {
      onSubmit({ plan: selectedPlan, billingCycle });
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for small shops starting out.',
      monthlyPrice: 49,
      yearlyPrice: 39, // 20% off
      features: [
        'Core loyalty features',
        'Up to 1,000 members',
        'Basic reporting',
        'Email support',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Grow your brand with advanced tools.',
      monthlyPrice: 99,
      yearlyPrice: 79, // 20% off
      features: [
        'Advanced analytics',
        '10,000 members',
        'Email automation',
        'Priority support',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Custom solutions for large scale.',
      monthlyPrice: 249,
      yearlyPrice: 199, // 20% off
      features: [
        'Unlimited members',
        'API & Webhook access',
        'Custom integrations',
        'Account manager',
      ],
    },
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'Yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  };

  return (
    <div className="max-w-[1100px] w-full flex flex-col gap-8">
      {/* Progress Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-6 justify-between items-center">
          <p className="text-[#141414] dark:text-white text-base font-semibold leading-normal uppercase tracking-wider">
            Step 2 of 4
          </p>
          <p className="text-[#141414] dark:text-[#ccc] text-sm font-normal">Plan Selection</p>
        </div>
        <div className="rounded-full bg-[#e0e0e0] dark:bg-[#333] overflow-hidden">
          <div className="h-2 rounded-full bg-primary" style={{ width: '50%' }}></div>
        </div>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <h1 className="text-[#141414] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
          Choose the right plan for your business
        </h1>
        <p className="text-[#757575] dark:text-[#aaa] text-lg font-normal leading-normal">
          Simple pricing that scales with your loyalty program. No hidden fees.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="flex h-12 w-full max-w-md items-center justify-center rounded-xl bg-[#e0e0e0] dark:bg-[#2a2a2a] p-1.5">
          <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-4 has-[:checked]:bg-white dark:has-[:checked]:bg-[#444] has-[:checked]:shadow-sm has-[:checked]:text-[#141414] dark:has-[:checked]:text-white text-[#757575] dark:text-[#999] text-sm font-bold leading-normal transition-all">
            <span className="truncate">Monthly</span>
            <input
              checked={billingCycle === 'Monthly'}
              onChange={() => setBillingCycle('Monthly')}
              className="invisible w-0"
              name="billing-cycle"
              type="radio"
              value="Monthly"
            />
          </label>
          <label className="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-4 has-[:checked]:bg-white dark:has-[:checked]:bg-[#444] has-[:checked]:shadow-sm has-[:checked]:text-[#141414] dark:has-[:checked]:text-white text-[#757575] dark:text-[#999] text-sm font-bold leading-normal transition-all">
            <span className="truncate">Yearly (Save 20%)</span>
            <input
              checked={billingCycle === 'Yearly'}
              onChange={() => setBillingCycle('Yearly')}
              className="invisible w-0"
              name="billing-cycle"
              type="radio"
              value="Yearly"
            />
          </label>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col gap-6 rounded-xl border ${
                isPopular
                  ? 'border-2 border-solid border-primary bg-white dark:bg-[#222] shadow-xl scale-105 z-10'
                  : isSelected
                  ? 'border-2 border-primary'
                  : 'border border-solid border-[#e0e0e0] dark:border-[#333] bg-white dark:bg-[#222]'
              } p-8 transition-shadow hover:shadow-lg`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <h2 className="text-[#141414] dark:text-white text-xl font-bold leading-tight">
                  {plan.name}
                </h2>
                <p className="text-[#757575] dark:text-[#aaa] text-sm">{plan.description}</p>
                <p className="flex items-baseline gap-1 text-[#141414] dark:text-white mt-4">
                  <span className="text-4xl font-black leading-tight tracking-[-0.033em]">
                    €{getPrice(plan)}
                  </span>
                  <span className="text-base font-bold">/month</span>
                </p>
              </div>
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-4 ${
                  isSelected || isPopular
                    ? 'bg-primary text-white'
                    : 'bg-[#f2f2f2] dark:bg-[#333] text-primary dark:text-white hover:bg-[#e8e8e8] dark:hover:bg-[#444]'
                } text-sm font-bold transition-colors hover:opacity-90`}
              >
                <span className="truncate">
                  {isSelected ? 'Selected' : 'Select Plan'}
                </span>
              </button>
              <div className="flex flex-col gap-4 border-t border-[#f2f2f2] dark:border-[#333] pt-6">
                {plan.features.map((feature, index) => (
                  <div
                    key={index}
                    className="text-[14px] font-normal flex gap-3 text-[#141414] dark:text-[#ccc]"
                  >
                    <span className="material-symbols-outlined text-green-600">check_circle</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Link & Footer Navigation */}
      <div className="flex flex-col items-center gap-10 mt-6">
        <a
          className="text-primary dark:text-white text-sm font-bold underline flex items-center gap-1 hover:opacity-80 transition-opacity"
          href="#"
        >
          Compare all features
          <span className="material-symbols-outlined !text-[16px]">open_in_new</span>
        </a>
        <div className="flex items-center justify-between w-full border-t border-[#e0e0e0] dark:border-[#333] pt-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary dark:text-[#ccc] font-bold text-sm hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Basic Info
          </button>
          <div className="flex gap-4">
            
            <button
              onClick={handleSubmit}
              disabled={!selectedPlan}
              className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
