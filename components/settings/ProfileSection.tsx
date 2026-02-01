'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface ProfileSectionProps {
  userId?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export default function ProfileSection({ userId }: ProfileSectionProps) {
  const { data: session, update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/profile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const result = await response.json();
        if (result.success && result.data) {
          const userData = result.data;
          setFullName(userData.name || '');
          setEmail(userData.email || '');
          setBio(userData.bio || '');
          setAvatar(userData.avatar || '');
          setAvatarPreview(userData.avatar || '');
        }
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      let avatarData = avatar;

      // If a new file is selected, convert it to base64
      if (selectedFile) {
        avatarData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          bio: bio,
          avatar: avatarData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      if (result.success) {
        setSuccess('Profile updated successfully!');
        setAvatar(avatarData);
        setAvatarPreview(avatarData);
        setSelectedFile(null);
        
        // Update NextAuth session
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name: fullName,
            email: email,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Profile</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </section>
    );
  }

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcjhS4M_PqGLDOKY5-cNnjEj6X1BN_AQrMVCHT3gLvkW0yI5FC4E2ohZMe-JzPCAxY9PW33255-cQD9wLubK0DzOXBEkTFbnuRTRTRlW68ub_dc0xv4xpuG1b0q0pF_nFfVBqBThRzBSBj76tIxhCbYV-jVldykf6jHmNudMbpOdztm4x69yILtphglkl_F_wn9B8qxVQhNcWapwlrcwKSIlXQ9Ioz3bohq8OJmBSWU9YxtReX3uQ6Bm_-gWsnkErP2NVYmJh_aA';

  return (
    <section className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Profile</h2>
      </div>
      <div className="p-6">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/20 p-4">
            <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="size-32 rounded-full bg-cover bg-center border-4 border-white shadow-md"
              style={{
                backgroundImage: avatarPreview
                  ? `url("${avatarPreview}")`
                  : `url("${defaultAvatar}")`,
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={handleChangePhotoClick}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedFile ? 'Photo Selected' : 'Change Photo'}
            </button>
            {selectedFile && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-[128px] truncate">
                {selectedFile.name}
              </p>
            )}
          </div>

          {/* Profile Form */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
              <input
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bio</label>
              <textarea
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm px-4 py-2 focus:ring-primary focus:border-primary"
                placeholder="Tell us about yourself..."
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary hover:bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
