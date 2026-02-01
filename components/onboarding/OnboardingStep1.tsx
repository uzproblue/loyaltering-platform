'use client';

import { useState } from 'react';

interface OnboardingStep1Props {
  onSubmit: (data: {
    businessName: string;
    category: string;
    locations: string;
    country: string;
  }) => void;
  onSkip: () => void;
}

export default function OnboardingStep1({ onSubmit, onSkip }: OnboardingStep1Props) {
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    locations: '',
    country: 'us',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.locations) {
      newErrors.locations = 'Please select number of locations';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-[560px] flex flex-col gap-8">
      {/* Progress Stepper */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary dark:text-gray-400">
              Step 1 of 4
            </span>
            <p className="text-[#141414] dark:text-white text-base font-semibold">Business Details</p>
          </div>
          <p className="text-[#757575] text-sm">25% Complete</p>
        </div>
        <div className="h-2 w-full bg-[#e0e0e0] dark:bg-[#333] rounded-full overflow-hidden">
          <div className="h-full bg-primary dark:bg-white transition-all duration-300" style={{ width: '25%' }} />
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white dark:bg-[#222] rounded-xl shadow-sm border border-[#e0e0e0] dark:border-[#333] p-8 md:p-10">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-[#141414] dark:text-white mb-2 tracking-tight">
            Business Profile
          </h1>
          <p className="text-[#757575] dark:text-gray-400 text-sm md:text-base">
            Tell us about your business to customize your loyalty platform experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Business Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[#141414] dark:text-white text-sm font-medium">Business Name</label>
            <input
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className={`w-full rounded-lg border ${
                errors.businessName
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-[#e0e0e0] dark:border-[#444]'
              } bg-white dark:bg-[#2b2b2b] text-[#141414] dark:text-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-[#ababab]`}
              placeholder="e.g. Loyaltering Coffee Roasters"
              type="text"
            />
            {errors.businessName && (
              <p className="text-[11px] text-red-500">{errors.businessName}</p>
            )}
            {!errors.businessName && (
              <p className="text-[11px] text-[#757575]">This name will be displayed to your customers.</p>
            )}
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-[#141414] dark:text-white text-sm font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-select-icon w-full rounded-lg border ${
                errors.category
                  ? 'border-red-500 dark:border-red-500'
                  : 'border-[#e0e0e0] dark:border-[#444]'
              } bg-white dark:bg-[#2b2b2b] text-[#141414] dark:text-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
            >
              <option disabled value="">
                Select category
              </option>
              <option value="cafe">Cafe & Bakery</option>
              <option value="restaurant">Restaurant & Dining</option>
              <option value="retail">Retail Shop</option>
              <option value="beauty">Beauty & Wellness</option>
              <option value="other">Other Services</option>
            </select>
            {errors.category && <p className="text-[11px] text-red-500">{errors.category}</p>}
          </div>

          {/* Number of Locations & Country Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[#141414] dark:text-white text-sm font-medium">Locations</label>
              <select
                name="locations"
                value={formData.locations}
                onChange={handleChange}
                className={`form-select-icon w-full rounded-lg border ${
                  errors.locations
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-[#e0e0e0] dark:border-[#444]'
                } bg-white dark:bg-[#2b2b2b] text-[#141414] dark:text-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
              >
                <option value="">Select locations</option>
                <option value="1">1 Location</option>
                <option value="2-5">2-5 Locations</option>
                <option value="6-10">6-10 Locations</option>
                <option value="11+">11+ Locations</option>
              </select>
              {errors.locations && <p className="text-[11px] text-red-500">{errors.locations}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#141414] dark:text-white text-sm font-medium">Country/Region</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="form-select-icon w-full rounded-lg border border-[#e0e0e0] dark:border-[#444] bg-white dark:bg-[#2b2b2b] text-[#141414] dark:text-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="ca">Canada</option>
                <option value="au">Australia</option>
                <option value="fr">France</option>
                <option value="de">Germany</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 flex flex-col gap-4">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-black dark:bg-white dark:text-primary dark:hover:bg-gray-200 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue to Step 2</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="text-sm font-medium text-[#757575] hover:text-[#141414] dark:hover:text-white transition-colors"
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-center gap-6 text-[#757575] text-xs">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <span>Secure encrypted data</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">support_agent</span>
          <span>24/7 Priority Support</span>
        </div>
      </div>
    </div>
  );
}

