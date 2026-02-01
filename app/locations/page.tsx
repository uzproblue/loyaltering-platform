import { redirect } from 'next/navigation';
import { getSession } from '@/lib/get-session';
import LocationsContent from './LocationsContent';

export default async function LocationsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  return <LocationsContent />;
}
