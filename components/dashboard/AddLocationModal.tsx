'use client';

import { useState, useEffect } from 'react';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
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
  }) => void;
}

export default function AddLocationModal({ isOpen, onClose, onSubmit }: AddLocationModalProps) {
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('Retail');
  const [operatorName, setOperatorName] = useState('');
  const [operatorEmail, setOperatorEmail] = useState('');
  const [autoInvite, setAutoInvite] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStoreName('');
      setAddress('');
      setCategory('Retail');
      setOperatorName('');
      setOperatorEmail('');
      setAutoInvite(true);
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName.trim() || !address.trim() || !operatorName.trim() || !operatorEmail.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: storeName.trim(),
          address: address.trim(),
          category,
          operatorName: operatorName.trim(),
          operatorEmail: operatorEmail.trim(),
          autoInvite,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to create location');
      }

      // Call onSubmit callback with the result data
      await onSubmit?.(result.data);
    } catch (error) {
      console.error('Error submitting location:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create location. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-[#e0e0e0] dark:border-[#333] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-primary dark:text-white leading-none">
              Add New Location
            </h2>
            <p className="text-sm text-[#757575] mt-1.5">
              Set up your first business location and assign an operator.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#757575] hover:text-primary dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Step 1: Location Details */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-white">
                  Location Details
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#757575] uppercase mb-1.5">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-background-light dark:bg-white/5 border border-[#e0e0e0] dark:border-[#333] rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    placeholder="e.g. Downtown Flagship Store"
                    required
                    autoFocus
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#757575] uppercase mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-background-light dark:bg-white/5 border border-[#e0e0e0] dark:border-[#333] rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Street, City, Zip Code"
                    required
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <label className="block text-xs font-semibold text-[#757575] uppercase mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-background-light dark:bg-white/5 border border-[#e0e0e0] dark:border-[#333] rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  >
                    <option>Retail</option>
                    <option>Food & Beverage</option>
                    <option>Health & Beauty</option>
                    <option>Services</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Location Operator */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="size-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary dark:text-white">
                  Location Operator
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 lg:col-span-1">
                  <label className="block text-xs font-semibold text-[#757575] uppercase mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full bg-background-light dark:bg-white/5 border border-[#e0e0e0] dark:border-[#333] rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Manager Name"
                    required
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <label className="block text-xs font-semibold text-[#757575] uppercase mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={operatorEmail}
                    onChange={(e) => setOperatorEmail(e.target.value)}
                    className="w-full bg-background-light dark:bg-white/5 border border-[#e0e0e0] dark:border-[#333] rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                    placeholder="manager@example.com"
                    required
                  />
                </div>
                <div className="col-span-2 flex items-center justify-between p-4 bg-background-light dark:bg-white/5 rounded-lg border border-[#e0e0e0] dark:border-[#333]">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-primary dark:text-white">
                      Auto-invite operator via email
                    </span>
                    <span className="text-xs text-[#757575]">
                      Sends access credentials immediately after creation.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoInvite}
                      onChange={(e) => setAutoInvite(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg text-sm font-bold text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isLoading ? 'Creating...' : 'Create Location'}</span>
                {!isLoading && (
                  <span className="material-symbols-outlined !text-[18px]">arrow_forward</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
