'use client';

import { useState } from 'react';

interface NewMemberRegistrationValues {
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  awardWelcomePoints: boolean;
}

interface NewMemberRegistrationProps {
  defaultValues?: Partial<NewMemberRegistrationValues>;
  onClose: () => void;
  onSubmit: (values: NewMemberRegistrationValues) => Promise<void> | void;
}

export default function NewMemberRegistration({ defaultValues, onClose, onSubmit }: NewMemberRegistrationProps) {
  const [values, setValues] = useState<NewMemberRegistrationValues>({
    name: defaultValues?.name ?? '',
    phone: defaultValues?.phone ?? '',
    email: defaultValues?.email ?? '',
    dateOfBirth: defaultValues?.dateOfBirth ?? '',
    awardWelcomePoints: defaultValues?.awardWelcomePoints ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: keyof NewMemberRegistrationValues, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [key]: value } as NewMemberRegistrationValues));
  };

  const handleSubmit = async () => {
    if (!values.name.trim() || !values.phone.trim() || !values.email.trim() || !values.dateOfBirth.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white dark:bg-background-dark border border-black/10 dark:border-white/10 rounded-xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">New Member Registration</h1>
          <p className="opacity-60 text-sm">Create a profile and award welcome points in seconds.</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-primary/40 hover:text-primary dark:text-white/40 dark:hover:text-white transition-colors"
          aria-label="Close"
          type="button"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="space-y-6">
      

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">Customer Name</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-sm">
                person
              </span>
              <input
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                placeholder="Full Name"
                type="text"
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider opacity-60">Mobile Number</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-sm">
                phone_iphone
              </span>
              <input
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                placeholder="+1 (555) 000-0000"
                type="tel"
                value={values.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider opacity-60">Email Address</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-sm">
              mail
            </span>
            <input
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              placeholder="email@example.com"
              type="email"
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider opacity-60">Date of Birth</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-sm">
              calendar_today
            </span>
            <input
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-black/10 dark:border-white/10 bg-background-light dark:bg-white/5 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
              placeholder="YYYY-MM-DD"
              type="date"
              value={values.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-white/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold">Award Welcome Points?</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                className="sr-only peer"
                type="checkbox"
                checked={values.awardWelcomePoints}
                onChange={(e) => handleChange('awardWelcomePoints', e.target.checked)}
              />
              <div className="w-11 h-6 bg-black/10 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="bg-primary/5 dark:bg-white/5 rounded-lg p-4 flex items-center justify-between border border-primary/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">stars</span>
              <span className="text-sm font-bold">New Member Bonus</span>
            </div>
            <span className="text-lg font-black text-primary">+50 pts</span>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <button
            className="flex-1 bg-primary text-white py-5 rounded-xl font-bold hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !values.name.trim() || !values.phone.trim() || !values.email.trim() || !values.dateOfBirth.trim()}
          >
            <span>Register &amp; Award First Points</span>
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </section>
  );
}

