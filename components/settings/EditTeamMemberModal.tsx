'use client';

import { useState, useEffect } from 'react';
import { Location } from './InviteTeamMemberModal';

export interface TeamMemberData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  locationAccess?: string[];
}

interface EditTeamMemberModalProps {
  isOpen: boolean;
  member: TeamMemberData | null;
  onClose: () => void;
  onUpdate?: (data: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'operator';
    locationIds: string[];
    password?: string;
  }) => void;
  locations?: Location[];
}

export default function EditTeamMemberModal({
  isOpen,
  member,
  onClose,
  onUpdate,
  locations = [],
}: EditTeamMemberModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'operator'>('admin');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const availableLocations = locations || [];

  // Populate form when member data is loaded
  useEffect(() => {
    if (member && isOpen) {
      setName(member.name);
      setEmail(member.email);
      setRole(member.role === 'user' ? 'operator' : 'admin');
      setSelectedLocations(member.locationAccess && member.locationAccess.length > 0 ? member.locationAccess : []);
      setChangePassword(false);
      setNewPassword('');
      setShowPassword(false);
    }
  }, [member, isOpen]);

  // When role changes to operator and multiple locations selected, keep only the first
  useEffect(() => {
    if (role === 'operator' && selectedLocations.length > 1) {
      setSelectedLocations([selectedLocations[0]]);
    }
  }, [role]);

  // Handle individual location checkbox
  const handleLocationChange = (locationId: string, checked: boolean) => {
    if (role === 'operator') {
      if (checked) {
        setSelectedLocations([locationId]);
      } else {
        if (selectedLocations.length === 1 && selectedLocations[0] === locationId) return;
        setSelectedLocations(selectedLocations.filter((id) => id !== locationId));
      }
    } else {
      if (checked) {
        setSelectedLocations([...selectedLocations, locationId]);
      } else {
        setSelectedLocations(selectedLocations.filter((id) => id !== locationId));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !member) return;

    if (role === 'operator') {
      if (selectedLocations.length !== 1) {
        alert('Operators must have exactly one location selected.');
        return;
      }
    } else {
      if (selectedLocations.length === 0) {
        alert('Please select at least one location for the admin.');
        return;
      }
    }

    if (changePassword && (!newPassword || newPassword.length < 8)) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    await onUpdate?.({
      id: member.id,
      name: name.trim(),
      email: email.trim(),
      role,
      locationIds: selectedLocations,
      password: changePassword ? newPassword : undefined,
    });
  };

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

  if (!isOpen || !member) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-background-dark w-full max-w-[560px] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="pt-8 pb-4 px-8 text-center relative">
          <h2 className="text-primary dark:text-white text-2xl font-bold tracking-tight">
            Edit Team Member
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Update their information, role, and location access.
          </p>
          {/* Close X Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="px-8 py-4 space-y-6">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input w-full rounded-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 text-sm placeholder:text-gray-400"
              placeholder="e.g., Jane Smith"
              required
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input w-full rounded-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 text-sm placeholder:text-gray-400"
              placeholder="e.g., name@company.com"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role</label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`relative flex flex-col items-start p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  role === 'admin'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="absolute top-4 right-4 text-primary focus:ring-primary"
                />
                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">Admin</span>
                <span className="text-xs text-gray-500 mt-1">
                  Full access to settings and analytics.
                </span>
              </label>
              <label
                className={`relative flex flex-col items-start p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  role === 'operator'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="operator"
                  checked={role === 'operator'}
                  onChange={() => setRole('operator')}
                  className="absolute top-4 right-4 text-primary focus:ring-primary"
                />
                <span className="font-bold text-sm text-gray-700 dark:text-gray-300">Operator</span>
                <span className="text-xs text-gray-500 mt-1">
                  Manage customers and redemptions.
                </span>
              </label>
            </div>
          </div>

          {/* Location Access - actual restaurant locations, no "All locations" option */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Location Access
            </label>
            {availableLocations.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/50">
                No locations yet. Add locations from the Locations page.
              </p>
            ) : (
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2 bg-gray-50 dark:bg-gray-900/50">
                {availableLocations.map((location) => (
                  <label
                    key={location.id}
                    className={`flex items-center gap-3 cursor-pointer group ${
                      role === 'operator' && selectedLocations.length === 1 && !selectedLocations.includes(location.id)
                        ? 'opacity-50'
                        : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLocations.includes(location.id)}
                      onChange={(e) => handleLocationChange(location.id, e.target.checked)}
                      disabled={role === 'operator' && selectedLocations.length === 1 && !selectedLocations.includes(location.id)}
                      className="rounded text-primary focus:ring-primary border-gray-300 dark:bg-gray-800 dark:border-gray-700 disabled:opacity-50"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">
                      {location.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Password Change Section */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={changePassword}
                onChange={(e) => setChangePassword(e.target.checked)}
                className="rounded text-primary focus:ring-primary border-gray-300 dark:bg-gray-800 dark:border-gray-700"
              />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Change Password
              </span>
            </label>
            {changePassword && (
              <div className="mt-2">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input w-full rounded-lg border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:border-primary focus:ring-1 focus:ring-primary h-12 text-sm placeholder:text-gray-400 pr-10"
                    placeholder="Enter new password (min. 8 characters)"
                    required={changePassword}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Password must be at least 8 characters long.
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-4 flex items-center justify-end gap-4 border-t border-gray-100 dark:border-gray-800 mt-4 bg-gray-50 dark:bg-gray-900/40 -mx-8 px-8 pb-8">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-4 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={availableLocations.length === 0}
              className="bg-primary hover:bg-black text-white px-8 h-12 rounded-lg font-bold text-sm tracking-wide transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
