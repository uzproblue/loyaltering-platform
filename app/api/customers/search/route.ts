import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const q = (url.searchParams.get('q') || '').trim();

    if (!q) {
      return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
    }

    // Get user profile to retrieve restaurantId
    const profileResponse = await fetch(`${API_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Email': session.user.email || '',
      },
      cache: 'no-store',
    });

    let restaurantId: string | null = null;
    let userId: string | null = null;

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      if (profileData.success && profileData.data) {
        restaurantId = profileData.data.restaurantId || null;
        userId = profileData.data.id || null;
      }
    }

    // Build search URL - prefer restaurantId, fallback to userId
    let searchUrl = `${API_URL}/api/customers/search?q=${encodeURIComponent(q)}`;
    if (restaurantId) {
      searchUrl += `&restaurantId=${encodeURIComponent(restaurantId)}`;
    }
    if (userId) {
      searchUrl += `&userId=${encodeURIComponent(userId)}`;
    }

    if (!restaurantId && !userId) {
      return NextResponse.json(
        { error: 'User restaurant not found. Please complete onboarding.' },
        { status: 400 }
      );
    }

    const upstream = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await upstream.json().catch(() => ({}));

    return NextResponse.json(data, { status: upstream.status });
  } catch (error) {
    console.error('Error searching customer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

