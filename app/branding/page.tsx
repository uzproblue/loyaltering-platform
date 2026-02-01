import { redirect } from 'next/navigation';
import { getSession } from '@/lib/get-session';
import BrandingContent from './BrandingContent';

export default async function BrandingPage() {
  // Check authentication
  const session = await getSession();
  
  if (!session) {
    redirect('/sign-in');
  }

  return <BrandingContent />;
}
