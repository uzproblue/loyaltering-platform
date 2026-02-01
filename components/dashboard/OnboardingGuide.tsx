'use client';

import Link from 'next/link';

interface OnboardingGuideProps {
  currentStep?: number;
  onboardingCompleted?: boolean;
  hasLocations?: boolean;
}

export default function OnboardingGuide({ currentStep = 1, onboardingCompleted = false, hasLocations = false }: OnboardingGuideProps) {
  const steps = [
    {
      number: 1,
      title: 'Business Information',
      description: 'Complete your enterprise profile and branding settings.',
      link: '/onboarding',
      linkText: 'Complete Onboarding',
      completed: onboardingCompleted || currentStep > 1,
    },
    {
      number: 2,
      title: 'Add First Location',
      description: 'Register your primary store or branch to start issuing stamps.',
      link: '#',
      linkText: 'Add Location →',
      completed: hasLocations || currentStep > 2,
    },
    {
      number: 3,
      title: 'Design Loyalty Card',
      description: 'Choose between point-based or stamp-based rewards.',
      link: '#',
      linkText: 'Learn how it works →',
      completed: currentStep > 3,
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-blue-200 dark:border-blue-900/30 shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-blue-600">auto_fix_high</span>
        <h3 className="text-lg font-bold">Onboarding Guide</h3>
      </div>
      <div className="flex flex-col gap-4">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep && !step.completed;
          const isCompleted = step.completed;
          const borderColor = isCompleted
            ? 'border-green-300 dark:border-green-700'
            : isActive
            ? 'border-blue-600'
            : 'border-gray-200 dark:border-gray-700';
          const bgColor = isCompleted
            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
            : isActive
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 dark:bg-[#333] text-[#757575]';
          const titleColor = isCompleted
            ? 'text-green-700 dark:text-green-400'
            : isActive
            ? 'text-primary dark:text-white'
            : 'text-gray-500';

          return (
            <div key={step.number} className={`relative pl-8 pb-4 ${index < steps.length - 1 ? 'border-l-2' : ''} ${borderColor}`}>
              <div className={`absolute -left-[11px] top-0 size-5 rounded-full ${bgColor} flex items-center justify-center text-[10px] font-bold`}>
                {isCompleted ? (
                  <span className="material-symbols-outlined !text-xs">check</span>
                ) : (
                  step.number
                )}
              </div>
              <h4 className={`text-sm font-bold ${titleColor}`}>{step.title}</h4>
              <p className="text-xs text-[#757575] mt-1 mb-2">{step.description}</p>
              {!isCompleted && (
                <Link
                  href={step.link}
                  className={`text-xs font-bold ${isActive ? 'text-blue-600 hover:underline' : 'text-[#757575] hover:text-primary dark:hover:text-white'}`}
                >
                  {step.linkText}
                </Link>
              )}
            </div>
          );
        })}
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 mt-2">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-green-600 !text-xl">rocket_launch</span>
            <div>
              <h5 className="text-xs font-bold text-green-700 mb-1">Ready to scale?</h5>
              <p className="text-[11px] text-green-600 leading-tight">
                Businesses that complete setup in the first 48 hours see 30% higher engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-[#e0e0e0] dark:border-[#333]">
        <h4 className="text-xs font-bold text-[#757575] uppercase mb-4">Quick Resources</h4>
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-3 w-full text-left text-sm font-medium text-[#757575] hover:text-primary dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-lg">play_circle</span>
            Setup Video Tutorial
          </button>
          <button className="flex items-center gap-3 w-full text-left text-sm font-medium text-[#757575] hover:text-primary dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined !text-lg">description</span>
            Integration Guide (API)
          </button>
        </div>
      </div>
    </div>
  );
}
