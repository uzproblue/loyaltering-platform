'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardContent from './DashboardContent';

export default function DashboardWrapper() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only check if session is loaded
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/sign-in');
      return;
    }

    // Check if onboarding was skipped in this session
    if (typeof window !== 'undefined') {
      const skipped = sessionStorage.getItem('onboarding_skipped');
      if (skipped === 'true') {
        // If skipped, allow access to dashboard without checking onboarding status
        return;
      }
    }

    // If not skipped, check onboarding status
    const checkOnboarding = async () => {
      try {
        const profileResponse = await fetch('/api/user/profile', {
          cache: 'no-store',
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const userRole = profileData.success && profileData.data?.role;
          const onboardingCompleted = profileData.success && profileData.data?.onboardingCompleted;
          
          // If user is "user" role, redirect to operator page
          if (userRole === 'user') {
            router.push('/operator');
            return;
          }
          
          // Check onboarding status for admin users
          // Only redirect if onboarding is not completed AND not skipped in this session
          if (
            (onboardingCompleted === false || onboardingCompleted === undefined) &&
            sessionStorage.getItem('onboarding_skipped') !== 'true'
          ) {
            router.push('/onboarding');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        // Don't redirect on error if skipped
        if (sessionStorage.getItem('onboarding_skipped') !== 'true') {
          router.push('/onboarding');
        }
      }
    };

    checkOnboarding();
  }, [session, status, router]);

  // Show loading or dashboard while checking
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return <DashboardContent />;
}
