import { redirect } from 'next/navigation';
import { getSession } from '@/lib/get-session';
import OnboardingContent from './OnboardingContent';

export default async function OnboardingPage() {
  // Check authentication
  const session = await getSession();
  
  if (!session) {
    redirect('/sign-in');
  }

  // Note: We can't check sessionStorage here (server component)
  // The client component will handle the skip check

  return <OnboardingContent />;
}

