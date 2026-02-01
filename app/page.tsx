import { redirect } from 'next/navigation';
import { getSession } from '@/lib/get-session';
import DashboardWrapper from './DashboardWrapper';

export default async function HomePage() {
  // Check authentication
  const session = await getSession();
  
  if (!session) {
    redirect('/sign-in');
  }

  // Use client component to handle sessionStorage check for skipped onboarding
  // This allows users who skipped onboarding to access dashboard in current session
  return <DashboardWrapper />;
}

