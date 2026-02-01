'use client';

import { useState, useEffect } from 'react';

export interface EditLocationFormData {
  id: string;
  name: string;
  address: string;
  category: string;
}

interface EditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: EditLocationFormData | null;
  onSaved?: () => void;
}

const CATEGORY_OPTIONS = ['Retail', 'Food & Beverage', 'Health & Beauty', 'Services'];

export default function EditLocationModal({
  isOpen,
  onClose,
  location,
  onSaved,
}: EditLocationModalProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('Retail');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && location) {
      setName(location.name);
      setAddress(location.address || '');
      setCategory(location.category || 'Retail');
      setError(null);
    }
  }, [isOpen, location]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location?.id || !name.trim() || !address.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/restaurants/${location.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          address: address.trim(),
          category: category.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to update location');
      }

      onClose();
      onSaved?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update location. Please try again.';
      setError(message);
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
        className="bg-white dark:bg-[#1e1e1e] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-[#e0e0e0] dark:border-[#333] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-primary dark:text-white leading-none">
              Edit Location
            </h2>
            <p className="text-sm text-[#757575] mt-1.5">
              Update location details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#757575] hover:text-primary dark:hover:text-white transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#757575] uppercase mb-1.5">
              Store Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background-light dark:bg-white/5 border border-[#e0e0e0] dark:border-[#333] rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-[#141414] dark:text-white"
              placeholder="e.g. Downtown Flagship Store"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#757575] uppercase mb-1.5">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-background-light dark:bg-white/5 border border-[#e0e0e0] dark:border-[#333] rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-[#141414] dark:text-white"
              placeholder="Street, City, Zip Code"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#757575] uppercase mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background-light dark:bg-white/5 border border-[#e0e0e0] dark:border-[#333] rounded-lg text-sm px-4 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-[#141414] dark:text-white"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#757575] hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-black transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
