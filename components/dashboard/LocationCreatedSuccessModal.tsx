'use client';

import { useState } from 'react';

interface LocationCreatedSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: {
    id: string;
    name: string;
    address: string;
    category: string;
    createdAt: string;
  };
  operator: {
    id: string;
    name: string;
    email: string;
    role: string;
    locationAccess: string[];
    password: string;
    createdAt: string;
  };
}

export default function LocationCreatedSuccessModal({
  isOpen,
  onClose,
  location,
  operator,
}: LocationCreatedSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(operator.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy password:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1e1e1e] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-8 border-b border-[#e0e0e0] dark:border-[#333] flex flex-col items-center text-center">
          <div className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined !text-4xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-primary dark:text-white leading-none">
            Location Created Successfully
          </h2>
          <p className="text-sm text-[#757575] mt-2">
            The new location has been registered and operator credentials generated.
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Location Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary dark:text-white !text-[20px]">
                storefront
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-white">
                Location Details
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-6 bg-background-light/50 dark:bg-white/5 p-5 rounded-xl border border-[#e0e0e0] dark:border-[#333]">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-bold text-[#757575] uppercase mb-1">
                  Store Name
                </label>
                <p className="text-sm font-medium text-primary dark:text-white">{location.name}</p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-[10px] font-bold text-[#757575] uppercase mb-1">
                  Category
                </label>
                <p className="text-sm font-medium text-primary dark:text-white">{location.category}</p>
              </div>
              <div className="col-span-2 border-t border-[#e0e0e0] dark:border-[#333] pt-4">
                <label className="block text-[10px] font-bold text-[#757575] uppercase mb-1">
                  Address
                </label>
                <p className="text-sm font-medium text-primary dark:text-white">{location.address}</p>
              </div>
            </div>
          </div>

          {/* Operator Access */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary dark:text-white !text-[20px]">
                badge
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-white">
                Operator Access
              </h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background-light/50 dark:bg-white/5 px-4 py-3 rounded-lg border border-[#e0e0e0] dark:border-[#333]">
                  <label className="block text-[10px] font-bold text-[#757575] uppercase mb-0.5">
                    Full Name
                  </label>
                  <p className="text-sm font-medium text-primary dark:text-white">{operator.name}</p>
                </div>
                <div className="bg-background-light/50 dark:bg-white/5 px-4 py-3 rounded-lg border border-[#e0e0e0] dark:border-[#333]">
                  <label className="block text-[10px] font-bold text-[#757575] uppercase mb-0.5">
                    Email Address
                  </label>
                  <p className="text-sm font-medium text-primary dark:text-white">{operator.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-xs font-bold text-primary dark:text-white uppercase tracking-tight">
                  Temporary Password
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      className="w-full bg-white dark:bg-black/20 border border-[#e0e0e0] dark:border-[#444] rounded-lg text-sm font-mono px-4 py-3 text-primary dark:text-white focus:ring-0 focus:border-[#e0e0e0]"
                      readOnly
                      type="text"
                      value={operator.password}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#757575] !text-lg">
                      lock
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPassword}
                    className="bg-primary text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-black transition-colors flex items-center gap-2 shrink-0"
                  >
                    <span className="material-symbols-outlined !text-[18px]">content_copy</span>
                    {copied ? 'Copied!' : 'Copy Password'}
                  </button>
                </div>
                <p className="text-[11px] text-[#757575]">
                  Securely share this password with the operator. They will be prompted to change it on their first login.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e0e0e0] dark:border-[#333] px-8 pb-8">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-lg text-sm font-bold text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            type="button"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
