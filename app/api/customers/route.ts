import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, dateOfBirth } = body;

    // Validate required fields
    if (!name || !email || !phone || !dateOfBirth) {
      return NextResponse.json(
        { error: 'Please provide name, email, phone number, and date of birth' },
        { status: 400 }
      );
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

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      if (profileData.success && profileData.data) {
        restaurantId = profileData.data.restaurantId || null;
      }
    }

    // Create customer via backend API
    const createResponse = await fetch(`${API_URL}/api/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        dateOfBirth,
        restaurantId: restaurantId || undefined,
      }),
    });

    const data = await createResponse.json().catch(() => ({}));

    return NextResponse.json(data, { status: createResponse.status });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
