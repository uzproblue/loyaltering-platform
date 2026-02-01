import { redirect } from 'next/navigation';
import { getSession } from '@/lib/get-session';
import OperatorContent from './OperatorContent';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default async function OperatorPage() {
  // Check authentication
  const session = await getSession();
  
  if (!session) {
    redirect('/sign-in');
  }

  // Check user role - allow both "admin" and "user" roles to access this page
  let userRole: string | null = null;
  try {
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': session.user.email || '',
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      userRole = data.success && data.data?.role;
      
      // Only allow admin and user roles to access this page
      if (userRole !== 'admin' && userRole !== 'user') {
        redirect('/');
      }
    }
  } catch (error) {
    console.error('Error checking user role:', error);
    // If check fails, redirect to dashboard for safety
    redirect('/');
  }

  return <OperatorContent userRole={userRole || 'user'} />;
}

