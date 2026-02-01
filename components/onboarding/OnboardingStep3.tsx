'use client';

import { useState } from 'react';

interface OnboardingStep3Props {
  onSubmit: (data: {
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
}

export default function OnboardingStep3({ onSubmit, onBack, selectedPlan }: OnboardingStep3Props) {
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    billingAddressSame: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.match(/.{1,4}/g)?.join(' ') || digits;
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)} / ${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData((prev) => ({ ...prev, expiryDate: formatted }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Card number is invalid';
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\s\/\s\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date format';
    }
    if (!formData.cvc) {
      newErrors.cvc = 'CVC is required';
    } else if (formData.cvc.length < 3) {
      newErrors.cvc = 'CVC must be at least 3 digits';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  // Default plan if not provided
  const plan = selectedPlan || {
    name: 'Professional',
    price: 99,
    billingCycle: 'Monthly' as 'Monthly' | 'Yearly',
  };

  const subtotal = plan.price;
  const tax = 0;
  const total = subtotal + tax;

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
        {/* Left Column: Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-[#1f1f1f] border border-[#e0e0e0] dark:border-[#333] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#141414] dark:text-white tracking-light text-xl font-bold leading-tight">
                  Card Details
                </h3>
                <div className="flex gap-2">
                  <span className="material-symbols-outlined text-[#757575] dark:text-[#a0a0a0]">lock</span>
                  <span className="text-xs text-[#757575] dark:text-[#a0a0a0] font-medium self-center">
                    SECURE
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                {/* Cardholder Name */}
                <div className="flex flex-col">
                  <label className="text-[#141414] dark:text-white text-sm font-semibold pb-2">
                    Cardholder Name
                  </label>
                  <input
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleChange}
                    className={`form-input w-full rounded-lg text-[#141414] dark:text-white border ${
                      errors.cardholderName
                        ? 'border-red-500'
                        : 'border-[#e0e0e0] dark:border-[#333]'
                    } bg-white dark:bg-[#2a2a2a] focus:ring-1 focus:ring-primary h-12 placeholder:text-[#757575] px-4 text-sm`}
                    placeholder="e.g. John Doe"
                  />
                  {errors.cardholderName && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.cardholderName}</p>
                  )}
                </div>

                {/* Card Number */}
                <div className="flex flex-col">
                  <label className="text-[#141414] dark:text-white text-sm font-semibold pb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className={`form-input w-full rounded-lg text-[#141414] dark:text-white border ${
                        errors.cardNumber ? 'border-red-500' : 'border-[#e0e0e0] dark:border-[#333]'
                      } bg-white dark:bg-[#2a2a2a] focus:ring-1 focus:ring-primary h-12 placeholder:text-[#757575] px-4 pr-24 text-sm`}
                      placeholder="0000 0000 0000 0000"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                      <div className="w-8 h-5 bg-[#f1f1f1] rounded flex items-center justify-center text-[8px] font-bold text-[#757575]">
                        VISA
                      </div>
                      <div className="w-8 h-5 bg-[#f1f1f1] rounded flex items-center justify-center text-[8px] font-bold text-[#757575]">
                        MC
                      </div>
                    </div>
                  </div>
                  {errors.cardNumber && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.cardNumber}</p>
                  )}
                </div>

                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[#141414] dark:text-white text-sm font-semibold pb-2">
                      Expiry Date
                    </label>
                    <input
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleExpiryDateChange}
                      maxLength={7}
                      className={`form-input w-full rounded-lg text-[#141414] dark:text-white border ${
                        errors.expiryDate ? 'border-red-500' : 'border-[#e0e0e0] dark:border-[#333]'
                      } bg-white dark:bg-[#2a2a2a] focus:ring-1 focus:ring-primary h-12 placeholder:text-[#757575] px-4 text-sm`}
                      placeholder="MM / YY"
                    />
                    {errors.expiryDate && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[#141414] dark:text-white text-sm font-semibold pb-2">
                      CVC
                    </label>
                    <div className="relative">
                      <input
                        name="cvc"
                        value={formData.cvc}
                        onChange={handleChange}
                        maxLength={4}
                        className={`form-input w-full rounded-lg text-[#141414] dark:text-white border ${
                          errors.cvc ? 'border-red-500' : 'border-[#e0e0e0] dark:border-[#333]'
                        } bg-white dark:bg-[#2a2a2a] focus:ring-1 focus:ring-primary h-12 placeholder:text-[#757575] px-4 pr-10 text-sm`}
                        placeholder="123"
                      />
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#757575] text-lg">
                        help_outline
                      </span>
                    </div>
                    {errors.cvc && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.cvc}</p>
                    )}
                  </div>
                </div>

                {/* Billing Address */}
                <div className="pt-4 border-t border-[#f2f2f2] dark:border-[#333] mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      name="billingAddressSame"
                      checked={formData.billingAddressSame}
                      onChange={handleChange}
                      className="rounded text-primary focus:ring-primary border-[#e0e0e0] size-4"
                      type="checkbox"
                    />
                    <span className="text-sm text-[#757575] dark:text-[#a0a0a0]">
                      Billing address same as company address
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Stripe Branding */}
            <div className="flex items-center justify-center gap-4 py-4 text-[#757575]">
              <span className="text-xs">Payments secured by</span>
              <div className="flex items-center gap-1 font-bold text-lg">
                <span className="material-symbols-outlined text-blue-500">payments</span>
                <span className="tracking-tight text-primary dark:text-white">stripe</span>
              </div>
            </div>
          </form>
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
              onClick={handleSubmit}
              className="w-full h-14 bg-primary hover:bg-[#404040] transition-colors rounded-lg text-white text-base font-bold tracking-[0.015em] flex items-center justify-center gap-2"
            >
              <span>Complete Setup</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <p className="mt-4 text-[10px] text-[#757575] text-center leading-relaxed">
              By clicking &quot;Complete Setup&quot;, you agree to Loyaltering&apos;s{' '}
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
