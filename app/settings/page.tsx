import { redirect } from 'next/navigation';
import { getSession } from '@/lib/get-session';
import SettingsContent from './SettingsContent';

export default async function SettingsPage() {
  // Check authentication
  const session = await getSession();
  
  if (!session) {
    redirect('/sign-in');
  }

  return <SettingsContent />;
}

