'use client';

type BrandingTab = 'signup' | 'wallet' | 'printables';

interface BrandingTabsProps {
  activeTab: BrandingTab;
  onTabChange: (tab: BrandingTab) => void;
}

export default function BrandingTabs({ activeTab, onTabChange }: BrandingTabsProps) {
  return (
    <div className="px-6 pt-6 pb-2">
      <h1 className="text-2xl font-bold text-primary dark:text-white mb-6">Branding Setup</h1>
      <div className="flex border-b border-[#e0e0e0] dark:border-[#333] gap-6">
        <button
          onClick={() => onTabChange('signup')}
          className={`flex flex-col items-center justify-center border-b-2 pb-3 transition-colors ${
            activeTab === 'signup'
              ? 'border-primary dark:border-white text-primary dark:text-white'
              : 'border-transparent text-[#757575] hover:text-[#141414] dark:hover:text-white'
          }`}
        >
          <p className="text-sm font-bold tracking-tight">Sign-Up Page</p>
        </button>
        <button
          onClick={() => onTabChange('wallet')}
          className={`flex flex-col items-center justify-center border-b-2 pb-3 transition-colors ${
            activeTab === 'wallet'
              ? 'border-primary dark:border-white text-primary dark:text-white'
              : 'border-transparent text-[#757575] hover:text-[#141414] dark:hover:text-white'
          }`}
        >
          <p className="text-sm font-bold tracking-tight">Wallet Card</p>
        </button>
        <button
          onClick={() => onTabChange('printables')}
          className={`flex flex-col items-center justify-center border-b-2 pb-3 transition-colors ${
            activeTab === 'printables'
              ? 'border-primary dark:border-white text-primary dark:text-white'
              : 'border-transparent text-[#757575] hover:text-[#141414] dark:hover:text-white'
          }`}
        >
          <p className="text-sm font-bold tracking-tight">Printables</p>
        </button>
      </div>
    </div>
  );
}
