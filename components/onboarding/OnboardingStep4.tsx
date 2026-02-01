'use client';

interface OnboardingStep4Props {
  onComplete: () => void;
  onExploreLater: () => void;
}

export default function OnboardingStep4({ onComplete, onExploreLater }: OnboardingStep4Props) {
  return (
    <div className="max-w-[1000px] w-full space-y-12 relative">
      {/* Subtle Background Graphics */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 confetti-bg"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex flex-col gap-3 max-w-[960px] mx-auto">
          <div className="flex gap-6 justify-between">
            <p className="text-[#141414] dark:text-white text-base font-medium leading-normal">
              Onboarding Progress
            </p>
            <p className="text-[#141414] dark:text-white text-sm font-normal leading-normal">
              Step 4 of 4
            </p>
          </div>
          <div className="rounded bg-[#e0e0e0] dark:bg-[#333]">
            <div className="h-2 rounded bg-primary dark:bg-white" style={{ width: '100%' }}></div>
          </div>
          <p className="text-[#757575] dark:text-[#a0a0a0] text-sm font-normal leading-normal">
            All set! Your workspace is ready.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary text-white rounded-full mb-4 shadow-xl shadow-primary/20">
          <span className="material-symbols-outlined text-3xl">celebration</span>
        </div>
        <h1 className="text-primary dark:text-white text-4xl md:text-5xl font-bold tracking-tight">
          Welcome to Loyaltering!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
          Setup complete. Your workspace is ready. Start growing your customer loyalty today with our
          quick-start tools.
        </p>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action Card 1 */}
        <div className="group bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary dark:hover:border-primary/50">
          <div className="mb-6 w-14 h-14 rounded-lg bg-primary/5 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <span className="material-symbols-outlined text-3xl">campaign</span>
          </div>
          <h3 className="text-xl font-bold text-primary dark:text-white mb-2">
            Create Your First Campaign
          </h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Launch rewards, points, or referral programs to engage your customers.
          </p>
        </div>

        {/* Action Card 2 */}
        <div className="group bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary dark:hover:border-primary/50">
          <div className="mb-6 w-14 h-14 rounded-lg bg-primary/5 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <span className="material-symbols-outlined text-3xl">location_on</span>
          </div>
          <h3 className="text-xl font-bold text-primary dark:text-white mb-2">Add a Location</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Set up your physical or digital storefronts to track customer visits.
          </p>
        </div>

        {/* Action Card 3 */}
        <div className="group bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary dark:hover:border-primary/50">
          <div className="mb-6 w-14 h-14 rounded-lg bg-primary/5 dark:bg-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <span className="material-symbols-outlined text-3xl">group_add</span>
          </div>
          <h3 className="text-xl font-bold text-primary dark:text-white mb-2">Invite Your Team</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Collaborate with your staff and managers to manage loyalty.
          </p>
        </div>
      </div>

      {/* Footer CTA Section */}
      <div className="flex flex-col items-center gap-6 pt-6">
        <button
          onClick={onComplete}
          className="flex min-w-[280px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-primary text-white text-lg font-bold tracking-tight shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span>Go to Dashboard</span>
          <span className="material-symbols-outlined ml-2">arrow_forward</span>
        </button>
        <button
          onClick={onExploreLater}
          className="text-slate-500 dark:text-slate-400 font-medium hover:text-primary dark:hover:text-white transition-colors"
        >
          I&apos;ll explore later
        </button>
      </div>
    </div>
  );
}
